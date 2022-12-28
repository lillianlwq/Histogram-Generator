predefind = [100.00, 95.00, 90.00, 85.00, 80.00, 75.00, 70.00, 65.00, 60.00, 55.00, 50.00, 0.00]
grade =[];
sortGrade=[];
csv = "" 
count = []
function init(){
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
  
function handleFileSelect(event){
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}
 
function handleFileLoad(event){
    //console.log(event);
    fieldsets = document.querySelectorAll("input[type=text]");
    m=0;
    for (let fieldset of fieldsets) {
        fieldset.value = predefind[m].toFixed(2);
        fieldset.style.backgroundColor = "rgb(247, 246, 246)";
        m += 1;
    }
    document.getElementById("isValid").innerHTML="";
    document.getElementById("instr3").innerHTML = ""

    document.getElementById('fileContent').textContent = event.target.result;
    csv = document.getElementById('fileContent').textContent;
    nameWithGrade = sortWithName(csv);
    sortNameWithGrade = nameWithGrade.sort(compNameGrade);
    //console.log("Sorted is " + sortNameWithGrade);
    grade = splitCSV(csv);
    //console.log(grade);
    sortGrade = grade.sort(comp)
    //console.log("inside handleFileLoad" + sortGrade)
    stats(predefind);
    count = numStudents(predefind)
    clearDrawing();
    drawHistogram(count)  
}

function clearDrawing() {
    canvas = document.getElementById("histogram")
    context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// EXTRACT ONLY the numerical information from csv file
function splitCSV(csv) {
    var rows = csv.split('\n');
    splitInfo = [];
    gradeStr = [];
    grade = [];
    
    for (let i = 1; i < rows.length; i++) {
        cols = rows[i].split('\r');
        splitInfo.push(cols[0]);
    }

    for (let j = 0; j < splitInfo.length; j++){
        cleanInfo = splitInfo[j].split(",");
        gradeStr.push(cleanInfo[1])
    }

    for (let i = 0; i < gradeStr.length; i++) {
        percent = 1 * gradeStr[i];
        grade.push(percent);
    }
   
    return grade
}

function sortWithName(csv) {
    splitInfoName = [];
    breakNameGrade = [];
    cleanNameGrade = [];
    var namePairs = csv.split('\n');
    for (let i = 1; i < namePairs.length; i++) {
        cols = namePairs[i].split('\r')
        splitInfoName.push(cols[0])
    }
    //console.log(splitInfoName);
    for (let j = 0; j < splitInfoName.length; j++){
         breakNameGrade = splitInfoName[j].split(",");
         cleanNameGrade.push(breakNameGrade);
        // console.log(breakNameGrade);
    }
    //console.log("Unsorted is " + cleanNameGrade);
    return cleanNameGrade;
}

// Comparator to sort the array
function comp(a,b){
    return a-b;
}

function compNameGrade(a,b) {
    return a[1] - b[1];
}

function areAllValid() {
    allValid = 0;
    for (let element of fields) {
        if (regexp.test(element.value) === false) {
            allValid = 0;
            document.getElementById("isValid").innerHTML = "Please enter positive numbers for ALL fields! ";
            //console.log("1allValid is " + allValid);
            return allValid;
        }
    }
    allValid = 1;
    return allValid;
}

function getUserInput(fields) {
    bounds = [];
    for (const each of fields) {
        val = Number(each.value)
        bounds.push(val.toFixed(2)) // check the case: 90 and 90.00, they are the same
    }
    boundsNumber = bounds.map(str => {
        return Number(str);
    });
    //console.log(typeof(boundsNumber[2]));
    return boundsNumber;
}

function containDuplicate(bounds) {
    if (bounds.length !== new Set(bounds).size) {
        return true; // contain duplicates values
      }
      return false;
}

function isDescending(bounds) {
    descending = true;
    for (let i = 1; i < bounds.length; i++) {  // not in descending order
         if (bounds[i-1] - (bounds[i]) < 0 ) {
             descending = false;
             return descending;
        } 
    } 
      return descending;
}

function whereToStartEnd(gradeLevel) {
    startPos = -1;
    endPos = -1;
    //console.log(sortGrade)
    //console.log("length is ", sortGrade.length)
    if(sortGrade.length === 1) {
        startPos = 0;
        endPos = 0;
        //console.log("here")
        return startPos, endPos
    }
    //console.log("orhere")
    i = 0; // max level position
    j = sortGrade.length-1; // min level position
    //qunScore = sortGrade.length-1
    
    //console.log(sortGrade)
    //console.log(gradeLevel)
    while (sortGrade[i] < gradeLevel[gradeLevel.length-1]) {
        i += 1;
        //console.log(i)
    }
    startPos = i;
    while (sortGrade[j]>gradeLevel[0]) {
        j -= 1;
        //console.log(j)
    }
    endPos = j
    return startPos, endPos
}

function calMean(st,ed) {
    
    var total = 0;
    //console.log("inside calMean"  + sortGrade)
    //console.log("st", st)
    //console.log("ed", ed)
    if(st === -1 || ed === -1) {
        meanGrade = 0.00;
        return meanGrade
    }
    if (st === 0 && ed === 0) {
        //console.log ("returned " , sortGrade[st]);
        return sortGrade[st]
    }
    for (let i = st; i<=ed; i++) {
        total += sortGrade[i];
    }
    meanGrade = (total/sortGrade.length).toFixed(2);
    return meanGrade;
}

function calMedian(st,ed) {
    if(st === -1 || ed === -1) {
        return 0.00
    }
    if (st === 0 && ed === 0) {
        return sortGrade[st]
    }
    newGrade = sortGrade.slice(st,ed+1);
    middle = Math.floor(newGrade.length / 2);
    if (newGrade.length % 2 === 0) {
        return ((newGrade[middle - 1] + newGrade[middle]) / 2).toFixed(2);
    }
    return newGrade[middle].toFixed(2);
}

function calMax(scoreBound) {
    maxGrade = sortNameWithGrade[sortNameWithGrade.length-1][1];
    firstGrade = sortNameWithGrade[0][1];
    //console.log(typeof(scoreBound[0]));
    //console.log("first grade " + firstGrade)
    //console.log("max grade " + maxGrade);
    if(firstGrade > scoreBound[0]){
        maxInfo = "All student grades are greater than the max you set"
        //console.log("check1")
        return maxInfo;
    }
    else if (maxGrade <= scoreBound[0]) {
        maxName = sortNameWithGrade[sortNameWithGrade.length-1][0];
        maxInfo = maxName.trim() + "(" + maxGrade + "%)"
        //console.log("check2")
        return maxInfo
    }
    else if (maxGrade > scoreBound[0]) {
        pos=1;
        //console.log("max is ", max);
        while(sortNameWithGrade[sortNameWithGrade.length-pos][1] > scoreBound[0]) {
            pos += 1;
            //console.log("move 1")
        }
        maxGrade=sortNameWithGrade[sortNameWithGrade.length-pos][1]
        maxName=sortNameWithGrade[sortNameWithGrade.length-pos][0]
        maxInfo = maxName.trim() + "(" + maxGrade + "%)"
        //console.log("check3")
        return maxInfo
    }
}

function calMin(scoreBounds) {
    minName = sortNameWithGrade[0][0];
    minGrade = sortNameWithGrade[0][1];
    lastGrade = sortNameWithGrade[sortNameWithGrade.length-1][1];
    if(lastGrade < scoreBounds[scoreBounds.length-1]){
        minInfo = "All student grades are less than the min you set";
        return minInfo;
    }
    else if (minGrade >= scoreBounds[scoreBounds.length-1]) {
        minInfo = minName.trim() + "(" + minGrade + "%)";
        return minInfo;
    }
    else if (minGrade < scoreBounds[scoreBounds.length-1]) {
        index = 0;
        while (sortNameWithGrade[index][1] < scoreBounds[scoreBounds.length-1]) {
            index += 1;
        }
        minGrade = sortNameWithGrade[index][1];
        minName = sortNameWithGrade[index][0];
        minInfo = minName.trim() + "(" + minGrade + "%)";
        return minInfo;
    }

}

function stats(level) {
    start = 0;
    end = 0;
    start,end = whereToStartEnd(level);
    //console.log(start);
    //console.log(end);
    mean = calMean(start,end);
    median = calMedian(start,end);
    max = calMax(level);
    min = calMin(level);
    document.getElementById("maxGrade").innerHTML = max;
    document.getElementById("minGrade").innerHTML = min;
    document.getElementById("meanGrade").innerHTML = mean;
    document.getElementById("medianGrade").innerHTML = median;
}

function clearStats() {
    document.getElementById("maxGrade").innerHTML = "Please correct all errors at first";
    document.getElementById("minGrade").innerHTML = "Please correct all errors at first";
    document.getElementById("meanGrade").innerHTML = "Please correct all errors at first";
    document.getElementById("medianGrade").innerHTML ="Please correct all errors at first";
}
function numStudents(gradeBounds) {
    //console.log("grade bounds"  + gradeBounds)
    aPlus = 0;
    a= 0;
    aMinus = 0;
    bPlus = 0;
    b= 0;
    bMinus = 0;
    cPlus = 0;
    c= 0;
    cMinus = 0;
    d = 0;
    f = 0;
    countStudents = [];
    //console.log ("pass here?")
    for (const grade of sortGrade) {
        if (grade >= gradeBounds[1] && grade <= gradeBounds[0]) {  // A+
            aPlus += 1;
        }
        else if (grade >= gradeBounds[2] && grade < gradeBounds[1]) { // A
            a += 1;
        }
        else if (grade >= gradeBounds[3] && grade < gradeBounds[2]) { // A-
            aMinus += 1;
        }
        else if (grade >= gradeBounds[4] && grade < gradeBounds[3]) {  // B+
            bPlus += 1;
        }
        else if (grade >= gradeBounds[5] && grade < gradeBounds[4]) { // B
            b += 1;
        }
        else if (grade >= gradeBounds[6] && grade < gradeBounds[5]) { // B-
            bMinus += 1;
        }
        else if (grade >= gradeBounds[7] && grade < gradeBounds[6]) {  // C+
            cPlus += 1;
        }
        else if (grade >= gradeBounds[8] && grade < gradeBounds[7]) { // C
            c += 1;
        }
        else if (grade >= gradeBounds[9] && grade < gradeBounds[8]) { // C-
            cMinus += 1;
        }
        else if (grade >= gradeBounds[10] && grade < gradeBounds[9]) { // D
            d += 1;
        }
        else if (grade >= gradeBounds[11] && grade < gradeBounds[10]) { // F
            f += 1;
        }
    }
    countStudents.push(aPlus);
    countStudents.push(a);
    countStudents.push(aMinus);
    countStudents.push(bPlus);
    countStudents.push(b);
    countStudents.push(bMinus);
    countStudents.push(cPlus);
    countStudents.push(c);
    countStudents.push(cMinus);
    countStudents.push(d);
    countStudents.push(f);

    return countStudents;
}

function drawHistogram(data) {
    canvas = document.getElementById("histogram")
    ctx = canvas.getContext('2d')
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height-40);
    ctx.stroke();
    ctx.moveTo(0, canvas.height-40);
    ctx.lineTo(canvas.width, canvas.height-40);
    ctx.stroke();
    letters = ['A+','A','A-','B+','B','B-','C+','C','C-','D','F'];

    for (let i=0; i<data.length; i++) {
        height = data[i] * 10;
        ctx.fillStyle='#695054';
        ctx.fillRect([i]+10,canvas.height-height-40,30,height);
        ctx.fillText(data[i], [i]+20,canvas.height-height-50);
        ctx.fillText(letters[i], [i]+20 ,canvas.height-20);
    }
}


fields = document.querySelectorAll("input[type=text]");
//console.log(fields);
var regexp = /^[+]?[0-9]*\.?[0-9]+$/;
filled = 0;
valid = 0;
//areAllFilled(fields);

document.getElementById("titleThree").innerHTML = "Step3: View Results(ONLY include grades between MAX and F)"
//gradeStu = splitCSV(csv);
    //console.log(grade);
//sortStuGrade = gradeStu.sort(comp)
//console.log ("Function sortGrade" + sortStuGrade);
count = numStudents(predefind);
//drawHistogram(count);

for (let j = 0; j < fields.length; j++) {
    fields[j].addEventListener("focus", function(evt){
        evt.target.style.backgroundColor = "#dae9f5";
        bounds = getUserInput(fields); // fetch all existing inputs
        containInvalid = areAllValid()
        if (containInvalid === 0) {
            document.getElementById("isValid").innerHTML = "Please enter positive numbers for ALL fields! ";
        }
     })

    fields[j].addEventListener("blur",function(evt){
        if (this.value.length == 0) { // user deletes pre-defined value but doesn't fill it back
            fields[j].value = predefind[j]; // fill it with pre-defined value for users
            //console.log ("fill back" + predefind[j]);  
        }
        if (regexp.test(this.value) === false) { 
            //evt.target.style.backgroundColor = "#f59595";
            clearDrawing();
            clearStats();
            document.getElementById("isValid").innerHTML = "Please enter positive numbers for ALL fields! ";
            document.getElementById("instr3").innerHTML = ""
            //allValid = 0;
        }
        else if (regexp.test(this.value) === true) {
            evt.target.style.backgroundColor = "#d6f7b5";
            document.getElementById("isValid").innerHTML = "";
            validStatus = areAllValid() // check whether existing inputs are in valid format or not (not considering overlapping or order for now)
            if (validStatus === 1) {
                bounds = getUserInput(fields); // fetch all existing inputs
                
                duplicate = containDuplicate(bounds); // check overlapping issue
                decreasing = isDescending(bounds); // check the order issue
                //console.log("duplicate", duplicate)
                if (duplicate == true) { // has overlap
                    clearDrawing();
                    clearStats();
                    document.getElementById("instr3").innerHTML = "Bounds of letter-grades must NOT overlap"
                }
                else {  // no overlap
                    if (decreasing == false) { // not in correct order
                        //document.getElementById("instr3").innerHTML = ""
                        clearDrawing();
                        clearStats();
                        document.getElementById("instr3").innerHTML = "The bound for lower level MUST be SMALLER than higher level"
                    }
                    else { // order is correct
                        document.getElementById("titleThree").innerHTML = "Step3: View Results(ONLY include grades between MAX and F)"
                        document.getElementById("instr3").innerHTML = ""
                        count = numStudents(bounds);
                        //console.log("Count is " + count);
                        clearDrawing();
                        drawHistogram(count); // update histogram part
                        //bounds = getUserInput(fields)
                        
                        //console.log(bounds);
                        stats(boundsNumber); // update statistics part
                
                    }
                } 
            } 
            else {
                bounds = getUserInput(fields);
                document.getElementById("isValid").innerHTML = "";
                duplicate = containDuplicate(bounds); // check overlapping issue
                decreasing = isDescending(bounds); // check the order issue
                if (duplicate == true) { // has overlap
                    clearDrawing();
                    clearStats();
                    document.getElementById("instr3").innerHTML = "Bounds of letter-grades must NOT overlap"
                }
                else {  // no overlap
                    document.getElementById("instr3").innerHTML = "";
                    if (decreasing == false) { // not in correct order
                        //document.getElementById("instr3").innerHTML = ""
                        clearDrawing();
                        clearStats();
                        document.getElementById("instr3").innerHTML = "The bound for lower level MUST be SMALLER than higher level"
                    }
                    else {
                        document.getElementById("instr3").innerHTML = "";
                    }
                }
            }
        }
        //areAllFilled(fields);
        //ableToViewResult();
    })
}




















