let lottoLandResponse;

const romanNumbers = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII' };

function numberWithCommas(x) {
    x = x.toFixed(2).toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) {
        x = x.replace(pattern, "$1,$2");
    }
    return x;
}

function template(data) {
    console.log(data);
    return `
        ${data.numbers.map((number) => `<span class="number">${number}</span>`).join('')}
        ${data.euroNumbers.map((euroNumber) => `<span class="number euro">${euroNumber}</span>`).join('')}
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
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

function saveLottolandResponse(response) {
    lottoLandResponse = response;
}

function init(response) {
    saveLottolandResponse(response);
    renderLottoland(response.last[0]);
}

function renderLottoland(data) {
    const transformedData = transformLottolandResponse(data);
    document.getElementById('table').innerHTML = template(transformedData);
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
