const romanNumbers = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII' };

function numberWithCommas(x) {
    x = (x/100).toFixed(2).toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) {
        x = x.replace(pattern, "$1,$2");
    }
    return x;
}

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

function init(response) {
    renderLottoland(response.last[0]);
    loadSelects(response);
    addSelectsListeners(response);
}

function renderLottoland(data) {
    const transformedData = transformLottolandResponse(data);
    document.getElementById('results').innerHTML = template(transformedData);
    document.getElementById('day').innerHTML = `${data.date.day}/${data.date.month}/${data.date.year}`;
}

function transformLottolandResponse(data) {
    const copiedData = _.cloneDeep(data);
    let odds = [];
    for(let i = 1; i <= 12; i++) {
        let key = `rank${i}`;
        odds.push({
            winners: data.odds[key].winners,
            prize: data.odds[key].prize,
            romanNumber: romanNumbers[i]
        });
    }
    copiedData.odds = odds;
    return copiedData;
}

function loadSelects(response) {
    loadDaySelect(response, response.last[0].date.year);
    loadYearSelect(response);
}

function loadDaySelect(response, year) {
    const daySelect = document.getElementById('day-select');
    for(let i = 0; i < daySelect.options.length; i++) {
        daySelect.options[i] = null;
    }
    _.groupBy(response.last, 'date.year')[year].forEach((data, index) => {
        daySelect.options[index] = new Option(`${data.date.day}/${data.date.month}/${data.date.year}`, data.nr);
    });
}

function loadYearSelect(response) {
    const yearSelect = document.getElementById('year-select');
    Object.keys(_.groupBy(response.last, 'date.year')).reverse().forEach((year, index) => {
        yearSelect.options[index] = new Option(year, year);
    });
}

function addSelectsListeners(response) {
    addSelectDayListener(response);
    addSelectYearListener(response);
}

function addSelectDayListener(response) {
    const daySelect = document.getElementById('day-select');
    daySelect.addEventListener('change', (event) => {
        renderLottoland(getDataByNr(event.target.value, response));
    });
}

function getDataByNr(nr, response) {
    return response.last.find((data) => {
        return data.nr == nr;
    });
}

function addSelectYearListener(response) {
    const yearSelect = document.getElementById('year-select');
    const daySelect = document.getElementById('day-select');
    yearSelect.addEventListener('change', (event) => {
        loadDaySelect(response, event.target.value);
        renderLottoland(getDataByNr(daySelect.value, response));
    });
}
