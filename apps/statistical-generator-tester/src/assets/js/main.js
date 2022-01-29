var listNumbers = [];
var u0975 = 1.959963985;
var n;

$(document).ready(function() {
    // Validace radio buttonu
    $('input[type=radio][name=rGeneratorSelected]').change(function() {
        if (this.value == 'optDefaultJS') {
            $("#inpSeedNumber").prop('disabled', true);
            $("#inpSeedNumber").val("");
            $("#lblInpSeedNumber").text("Seed (nelze):");
        }
        else if (this.value == 'optSeedRandomJS') {
            $("#inpSeedNumber").prop('disabled', false);
            $("#inpSeedNumber").val("");
            $("#lblInpSeedNumber").text("Seed (volitelně):");
        }
        else if (this.value == 'optMersenne') {
            $("#inpSeedNumber").prop('disabled', false);
            $("#inpSeedNumber").val(1213);
            $("#lblInpSeedNumber").text("Seed (povinně):");
        }
        else if (this.value == 'optChanceJS') {
            $("#inpSeedNumber").prop('disabled', false);
            $("#inpSeedNumber").val("");
            $("#lblInpSeedNumber").text("Seed (volitelně):");
        }
    });

    // Validace poctu generovanych cisel
    $('input[type=text][id=inpNumbersGenerated]').change(function() {
        if (parseInt(this.value) > 0) {
            $("#btnGenerate").prop('disabled', false);
        } else {
            $("#btnGenerate").prop('disabled', true);
        }
    });

    // Validace vlastnich vkladanych cisel
    $('#ownNumbersArea').bind('input propertychange', function() {
        if (this.value.length) {
            $("#btnGetOwnNumbers").prop('disabled', false);
        } else {
            $("#btnGetOwnNumbers").prop('disabled', true);
        }
    });
});

/**
 * Metoda pro generovani cisel na zaklade ruznych zdroju.
 */
function generateNumbers() {
    $("#generatedNumberArea").empty();
    listNumbers.length = 0;
    var countNumbersGenerated = parseInt(document.getElementById("inpNumbersGenerated").value);
    var seedNumber;

    if (document.getElementById("optradioDefaultJS").checked) {
        for(i = 0; i < countNumbersGenerated; i++) {
            listNumbers[i] = Math.random();
            $("#generatedNumberArea").append(listNumbers[i] + "\n");
        }
    }

    // Random knihovny seedrandom.js
    if (document.getElementById("optradioSeedRandomJS").checked) {
        // Nastavuje Math.random na GPNC zalozeny na ARC4, kteremu je nastaven automaticky seed pouzitim
        // aktualniho casu, statusu HTML DOM, a dalsich lokalnich informaci.
        var seedRandom = new Math.seedrandom();

        // Pokud byl zadán seed
        if (document.getElementById("inpSeedNumber").value != "") {
            seedNumber = parseInt(document.getElementById("inpSeedNumber").value);
            seedRandom = new Math.seedrandom(seedNumber);
        }

        for(i = 0; i < countNumbersGenerated; i++) {
            listNumbers[i] = seedRandom();
            $("#generatedNumberArea").append(listNumbers[i] + "\n");
        }
    }

    // Random Mersenne Twister knihovny Random.js
    if (document.getElementById("optradioMersenne").checked) {
        // Pokud byl zadán seed (povinne)
        if (document.getElementById("inpSeedNumber").value != "") {
            seedNumber = parseInt(document.getElementById("inpSeedNumber").value);
            var engine = Random.engines.mt19937().seed(seedNumber);
            var random = new Random(engine);

            for(i = 0; i < countNumbersGenerated; i++) {
                listNumbers[i] = random.real(0, 1, false);
                $("#generatedNumberArea").append(listNumbers[i] + "\n");
            }
        }
    }

    if (document.getElementById("optradioChanceJS").checked) {
        var chance;
        if (document.getElementById("inpSeedNumber").value != "") {
            // Pokud byl zadan seed, nastav ho
            seedNumber = parseInt(document.getElementById("inpSeedNumber").value);
            chance = new Chance(seedNumber);
        } else {
            // Pokud nebyl zadan seed, generuj nahodne
            chance = new Chance();
        }

        for(i = 0; i < countNumbersGenerated; i++) {
            listNumbers[i] = chance.random();
            $("#generatedNumberArea").append(listNumbers[i] + "\n");
        }
    }

    $("#btnTestExtremal").prop('disabled', false);
    $("#btnTestDifference").prop('disabled', false);
    $("#btnTestSpearman").prop('disabled', false);
    $("#btnTestSerial").prop('disabled', false);
}

/**
 * Metoda pro ziskani vlastnich cisel zadanych do textArea.
 */
function getOwnNumbers() {
    listNumbers.length = 0;
    var textArea = document.getElementById("ownNumbersArea");
    var arrayOfLines = textArea.value.split("\n");
    for(var i = 0; i < arrayOfLines.length; i++){
        if (parseFloat(arrayOfLines[i]) != 'NaN') {
            listNumbers[i] = parseFloat(arrayOfLines[i]);
        }
    }

    $("#btnTestExtremal").prop('disabled', false);
    $("#btnTestDifference").prop('disabled', false);
    $("#btnTestSpearman").prop('disabled', false);
    $("#btnTestSerial").prop('disabled', false);
}

function testCommon() {
    // Obecne
    n = listNumbers.length;
}

/**
 * Metoda pro testovani bodu zvratu.
 */
function testExtremal() {
    emptyBoxes();
    testCommon();
    $("#extremalBox").append("<h3>Test bodů zvratu</h3>");

    // TEST BODU ZVRATU
    var extremalE = (2 * (n - 2)) / 3;
    var extremalD = (16 * n - 29) / 90;

    var extremalP = 0;
    for(i = 0; i < n - 2; i++) {
        if ((listNumbers[i] < listNumbers[i + 1] && listNumbers[i + 1] > listNumbers[i + 2]) ||
            (listNumbers[i] > listNumbers[i + 1] && listNumbers[i + 1] < listNumbers[i + 2] )) {
            extremalP += 1;
        }
    }

    var extremalU = (extremalP - extremalE) / Math.sqrt(extremalD);

    $("#extremalBox").append("$H_0:$ Posloupnost čísel je náhodná<br/>");
    $("#extremalBox").append("$H_1:$ Posloupnost čísel není náhodná<br/><br/>");
    $("#extremalBox").append("$n$ = " + n + "<br/>");
    $("#extremalBox").append("$P$ = " + extremalP + "<br/>");
    $("#extremalBox").append("$E(P)$ = " + extremalE.toFixed(4) + "<br/>");
    $("#extremalBox").append("$D(P)$ = " + extremalD.toFixed(4) + "<br/>");
    $("#extremalBox").append("$u$ = " + extremalU.toFixed(4) + "<br/><br/>");

    var resultRejected = Math.abs(extremalU) > u0975;
    if (resultRejected) {
        $("#extremalBox").append("$|u| > u_{1-{\\alpha / 2}}$<br/>");
        $("#extremalBox").append(Math.abs(extremalU).toFixed(4) + " $>$ " + u0975.toFixed(2) + "<br/>");
        $("#extremalBox").append("<span class='text-red'><b>Zamítá</b></span> se hypotéza o náhodnosti v uspořádání řady hodnot.");
    } else {
        $("#extremalBox").append("$|u| \\leq u_{1-{\\alpha / 2}}$<br/>");
        $("#extremalBox").append(Math.abs(extremalU).toFixed(4) + " $\\leq$ " + u0975.toFixed(2) + "<br/>");
        $("#extremalBox").append("<span class='text-green'><b>Nezamítá</b></span> se hypotéza o náhodnosti v uspořádání řady hodnot.");
    }

    refreshMathJax()
}

/**
 * Metoda pro vypocet testu znamenek diferenci.
 */
function testDifference() {
    emptyBoxes();
    testCommon();
    $("#diffBox").append("<h3>Test znamének diferencí</h3>");

    // TEST ZNAMENEK DIFFERENCI
    var diffE = (n - 1) / 2;
    var diffD = (n + 1) / 12

    var diffC = 0;
    for(i = 0; i < n - 1; i++) {
        if (listNumbers[i + 1] > listNumbers[i]) {
            diffC += 1;
        }
    }

    var diffU = (diffC - diffE) / Math.sqrt(diffD);

    $("#diffBox").append("$H_0:$ Posloupnost čísel je náhodná<br/>");
    $("#diffBox").append("$H_1:$ Posloupnost čísel není náhodná<br/><br/>");
    $("#diffBox").append("$n$ = " + n + "<br/>");
    $("#diffBox").append("$C$ = " + diffC + "<br/>");
    $("#diffBox").append("$E(C)$ = " + diffE + "<br/>");
    $("#diffBox").append("$D(C)$ = " + diffD.toFixed(4) + "<br/>");
    $("#diffBox").append("$u$ = " + diffU.toFixed(4) + "<br/><br/>");

    var resultRejected = Math.abs(diffU) > u0975;
    if (resultRejected) {
        $("#diffBox").append("$|u| > u_{1-{\\alpha / 2}}$<br/>");
        $("#diffBox").append(Math.abs(diffU).toFixed(4) + " $>$ " + u0975.toFixed(2) + "<br/>");
        $("#diffBox").append("<span class='text-red'><b>Zamítá</b></span> se hypotéza o náhodnosti v uspořádání řady hodnot.");
    } else {
        $("#diffBox").append("$|u| \\leq u_{1-{\\alpha / 2}}$<br/>");
        $("#diffBox").append(Math.abs(diffU).toFixed(4) + " $\\leq$ " + u0975.toFixed(2) + "<br/>");
        $("#diffBox").append("<span class='text-green'><b>Nezamítá</b></span> se hypotéza o náhodnosti v uspořádání řady hodnot.");
    }

    refreshMathJax()
}

/**
 * Metoda pro vypocet Spearmanova poradoveho koeficientu korelace.
 */
function testSpearman() {
    emptyBoxes();
    testCommon();
    $("#diffBox").append("<h3>Spearmanův pořadový koeficient korelace</h3>");

    // SPEARMANUV PORADOVY KOEFICIENT KORELACE
    $("#spearmanBox").append("<div id='spearmanResultsBox'></div>");
    $("#spearmanBox").append("<table class='table table-striped table-condensed' id='spearmanTable'>" +
        "<tr><th>$x$</th><th>$R_i$</th><th>$Q_i$</th><th>$d_i$</th><th>$d_i^2$</th></tr></table>");

    var listRi = [];
    for(i = 1; i <= n; i++) {
        listRi[i - 1] = i;
    }

    var listQi = [];
    var listdi = [];
    var listdi2 = [];
    var sumdi2 = 0;
    for(i = 0; i < n; i++) {
        listQi[i] = 0;
        for(j = 0; j < n; j++) {
            if(listNumbers[j] <= listNumbers[i]) {
                listQi[i] += 1;
            }
        }
        listdi[i] = listRi[i] - listQi[i];
        listdi2[i] = Math.abs(listdi[i]) * Math.abs(listdi[i]);
        $("#spearmanTable").append("<tr><td>" + listNumbers[i] + "</td><td>" + listRi[i] + "</td><td>" + listQi[i] +
            "</td><td>" + listdi[i] + "</td><td>" + listdi2[i] + "</td></tr>");
        sumdi2 += listdi2[i];
    }

    var spearmanE = 0;
    var spearmanD = 1 / (n - 1);
    var spearmanR = 1 - (6/(n * (n * n - 1))) * sumdi2;
    var spearmanU = spearmanR * Math.sqrt(n - 1);

    $("#spearmanResultsBox").append("$H_0: \\rho_s = 0$<br/>");
    $("#spearmanResultsBox").append("$H_1: \\rho_s \\neq 0$ <br/><br/>");
    $("#spearmanResultsBox").append("$E(r_s)$ = " + spearmanE + "<br/>");
    $("#spearmanResultsBox").append("$D(r_s)$ = " + spearmanD.toFixed(4) + "<br/>");
    $("#spearmanResultsBox").append("$r_s$ = " + spearmanR.toFixed(4) + "<br/>");
    $("#spearmanResultsBox").append("$u$ = " + spearmanU.toFixed(4) + "<br/><br/>");

    var resultRejected = Math.abs(spearmanU) > u0975;
    if (resultRejected) {
        $("#spearmanResultsBox").append("$|u| > u_{1-{\\alpha / 2}}$<br/>");
        $("#spearmanResultsBox").append(Math.abs(spearmanU).toFixed(4) + " $>$ " + u0975.toFixed(2) + "<br/>");
        $("#spearmanResultsBox").append("<span class='text-red'><b>Zamítá</b></span> se hypotéza o nulovém " +
            "koeficientu korelace nezávisloti na pořadí.<br/><br/>");
    } else {
        $("#spearmanResultsBox").append("$|u| \\leq u_{1-{\\alpha / 2}}$<br/>");
        $("#spearmanResultsBox").append(Math.abs(spearmanU).toFixed(4) + " $\\leq$ " + u0975.toFixed(2) + "<br/>");
        $("#spearmanResultsBox").append("<span class='text-green'><b>Nezamítá</b></span> se hypotéza o nulovém " +
            "koeficientu korelace nezávisloti na pořadí.<br/><br/>");
    }

    refreshMathJax()
}

/**
 * Metoda pro test serialni korelace.
 */
function testSerial() {
    emptyBoxes();
    testCommon();
    $("#serialBox").append("<h3>Seriální koeficient korelace</h3>");
    $("#serialBox").append("$H_0: \\rho_k = 0$<br/>");
    $("#serialBox").append("$H_1: \\rho_k \\neq 0$ <br/><br/>");

    // SERIALNI KORELACE
    $("#serialBox").append("<table class='table table-striped table-condensed' id='serialTable'>" +
        "<tr><th>$k$</th><th>$r_k$</th><th>$r_k \\sqrt{n-k}$</th><th>Výsledek pro $\\alpha = 0,05$</th></tr></table>");

    var cochSumri2 = 0;
    // TODO k < n
    for(k = 1; k <= 10; k++) {
        // Cinitel
        var pom1 = 0;
        for(i = 1; i <= n - k; i++) {
            var sumXj1 = 0;
            for(j = 1; j <= n - k; j++) {
                sumXj1 += listNumbers[j - 1];
            }

            var sumXj2 = 0;
            for(j = k; j <= n; j++) {
                sumXj2 += listNumbers[j - 1];
            }
            pom1 += (listNumbers[i - 1] - (1 / (n - k)) * sumXj1) * (listNumbers[i + k - 1] - (1 / (n - k)) * sumXj2);
        }
        var rkCov = pom1 / (n - k);

        // Jmenovatel leva cast
        var sum3 = 0;
        for(i = 1; i <= n - k; i++) {
            var sumXj3 = 0;
            for(j = 1; j <= n - k; j++) {
                sumXj3 += listNumbers[j - 1];
            }
            sum3 += (listNumbers[i - 1] - (1 / (n - k)) * sumXj3) * (listNumbers[i - 1] - (1 / (n - k)) * sumXj3);
        }
        var variance1 = (1 / (n - k)) * sum3;

        // Jmenovatel prava cast
        var sum4 = 0;
        for(i = 1; i <= n - k; i++) {
            var sumXj4 = 0;
            for(j = k; j <= n; j++) {
                sumXj4 += listNumbers[j - 1];
            }
            sum4 += (listNumbers[i + k - 1] - (1 / (n - k)) * sumXj4)
                * (listNumbers[i + k - 1] - (1 / (n - k)) * sumXj4);
        }
        var variance2 = (1 / (n - k)) * sum4;

        // Celkovy jmenovatel
        var overallDenominator = Math.sqrt(variance1 * variance2);

        var rk = rkCov / overallDenominator;
        cochSumri2 += rk * rk;
        var rkU = rk * Math.sqrt(n - k);

        var resultText;
        if (rkU > u0975) {
            resultText = "<span class='text-red'><b>Zamítá</b></span> se hypotéza o nulovém koef. seriální korelace."
        } else {
            resultText = "<span class='text-green'><b>Nezamítá</b></span> se hypotéza o nulovém koef. seriální korelace."
        }
        $("#serialTable").append("<tr><td>" + k + "</td><td>" + rk.toFixed(6) + "</td><td>"
            + rkU.toFixed(6) + "</td><td>" + resultText + "</td></tr>");
    }

    // VYSLEDKY COCHRANOVA TESTU
    var cochQ = n * cochSumri2;
    var Q0975_10 = 18.307;

    $("#serialBox").append("<h3>Cochranův test</h3>");
    $("#serialBox").append("$H_0: \\rho_1 = \\rho_2 = \\ldots = \\rho_k = 0$ pro $i = 1, 2, \\ldots , k$<br/>");
    $("#serialBox").append("$H_1: \\rho_i \\neq 0$ pro al. jedno $i$ <br/><br/>");
    $("#serialBox").append("$Q = \\sum_{i=1}^k r_i^2 \\doteq " + n + "\\cdot" + cochSumri2.toFixed(6) +
        " \\doteq " + cochQ.toFixed(3) + "$<br/>");
    $("#serialBox").append("$Q_{1-{\\alpha / 2}, k} = Q_{0.975, 10} = " + Q0975_10 + "$<br/><br/>");

    var resultRejected = cochQ > Q0975_10;
    if (resultRejected) {
        $("#serialBox").append("$Q > Q_{1-{\\alpha / 2}, k}$<br/>");
        $("#serialBox").append(cochQ.toFixed(3) + " $>$ " + Q0975_10 + "<br/><br/>");
        $("#serialBox").append("<span class='text-red'><b>Zamítá</b></span> se sdružená hypotéza.<br/><br/>");
    } else {
        $("#serialBox").append("$Q \\leq Q_{1-{\\alpha / 2}, k}$<br/>");
        $("#serialBox").append(cochQ.toFixed(3) + " $\\leq$ " + Q0975_10 + "<br/><br/>");
        $("#serialBox").append("<span class='text-green'><b>Nezamítá</b></span> se sdružená hypotéza.<br/><br/>");
    }

    refreshMathJax();
}

function testFrequency() {



}

/**
 * Metoda pro spusteni vsech testu.
 */
function testAllTests() {
    testExtremal();
    testDifference();
    testSpearman();
    testSerial()
}

/**
 * Metoda pro refresh MathJaxu ve vsech boxech.
 */
function refreshMathJax() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "extremalBox"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "diffBox"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "spearmanBox"]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "serialBox"]);
}

/**
 * Metoda pro promazani vsech boxu.
 */
function emptyBoxes() {
    $("#extremalBox").empty();
    $("#diffBox").empty();
    $("#spearmanBox").empty();
    $("#serialBox").empty();
}