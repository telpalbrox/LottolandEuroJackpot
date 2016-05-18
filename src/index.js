const romanNumbers = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII' };

/**
 * Format number with comas and decimals
 * @param {number} number - Number to to format with comas and decimals
 * @returns {string} string - formatted number
 */
function numberWithCommas(number) {
    let string = (number/100).toFixed(2).toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(string)) {
        string = string.replace(pattern, '$1,$2');
    }
    return string;
}

/**
 * Template to render a day result
 * @param {object} data - result for a day
 * @returns {string} html - rendered html
 */
function template(data) {
    return `
        <div class="numbers">
            ${data.numbers.map((number) => `<span class="number">${number}</span>`).join('')}
            ${data.euroNumbers.map((euroNumber) => `<span class="number euro">${euroNumber}</span>`).join('')}
        </div>
        <table class="mdl-data-table mdl-shadow--2dp results-table">
            ${data.odds.map((odd) => {
                return `
                    <tr>
                        <td>
                            Tier ${odd.romanNumber}
                        </td>
                        <td>
                            ${odd.winners}x
                        </td>
                        <td>
                            €${numberWithCommas(odd.prize)}
                        </td>
                    </tr>
                `
            }).join('') }
        </table>
    `;
}

/**
 * Callback of the JSONP response
 * @param {object} response - API response
 */
function init(response) {
    renderLottoland(response.last[0]);
    loadSelects(response);
    addSelectsListeners(response);
}

/**
 * Render the a day result
 * @param data
 */
function renderLottoland(data) {
    const transformedData = transformLottolandResponse(data);
    document.getElementById('results').innerHTML = template(transformedData);
    document.getElementById('day').innerHTML = `${data.date.day}/${data.date.month}/${data.date.year}`;
}

/**
 * Transform api odds resutls from object to array. Also add romanNumber to transformed object
 * @param {object} data - A day result
 * @returns {object} trasnformed API result
 */
function transformLottolandResponse(data) {
    const copiedData = _.cloneDeep(data);
    let odds = [];
    // loop over 12 tiers
    for(let i = 1; i <= 12; i++) {
        let key = `rank${i}`;
        odds.push({
            winners: data.odds[key].winners,
            prize: data.odds[key].prize,
            romanNumber: romanNumbers[i] // add roman number
        });
    }
    copiedData.odds = odds;
    return copiedData;
}

/**
 * Load selects with initial data
 * @param {object} response API
 */
function loadSelects(response) {
    loadDaySelect(response, response.last[0].date.year);
    loadYearSelect(response);
}

/**
 * Load day select with the days of a year
 * @param {object} response API
 * @param {number} year
 */
function loadDaySelect(response, year) {
    // reset current days
    const daySelect = document.getElementById('day-select');
    for(let i = 0; i < daySelect.options.length; i++) {
        daySelect.options[i] = null;
    }

    // group response by year and add options to the select HTML element
    _.groupBy(response.last, 'date.year')[year].forEach((data, index) => {
        daySelect.options[index] = new Option(`${data.date.day}/${data.date.month}/${data.date.year}`, data.nr);
    });
}

/**
 * Load year select with all years
 * @param {object} response API
 */
function loadYearSelect(response) {
    const yearSelect = document.getElementById('year-select');
    // get all years and add to the select HTML element
    Object.keys(_.groupBy(response.last, 'date.year')).reverse().forEach((year, index) => {
        yearSelect.options[index] = new Option(year, year);
    });
}

function addSelectsListeners(response) {
    addSelectDayListener(response);
    addSelectYearListener(response);
}

/**
 * Add a change lister to day select in order of render the new results for selected day
 * @param {object} response API
 */
function addSelectDayListener(response) {
    const daySelect = document.getElementById('day-select');
    daySelect.addEventListener('change', (event) => {
        // get the day result by this nr property and render it
        renderLottoland(getDataByNr(event.target.value, response));
    });
}

/**
 * Get a day result from the full API response and its nr
 * @param {number|string} nr - nr property from the full API response
 * @param {object} response API
 * @returns {object} results for a day
 */
function getDataByNr(nr, response) {
    return response.last.find((data) => {
        return data.nr == nr;
    });
}

/**
 * Add a change lister to year select in order of render the last day of the year and update day select
 * @param {object} response API
 */
function addSelectYearListener(response) {
    const yearSelect = document.getElementById('year-select');
    const daySelect = document.getElementById('day-select');
    yearSelect.addEventListener('change', (event) => {
        loadDaySelect(response, event.target.value);
        renderLottoland(getDataByNr(daySelect.value, response));
    });
}
