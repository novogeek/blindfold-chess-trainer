var ranks, files = 0;
var str = '';
var color1 = 'white';
var color2 = 'black';
var charCodeStart = 65;
var arrSquares = [];
var timeOutID, timerID, speed, index;
var answered = false;
var timer, score = 0;
var btnClickAddClass = 'ui-state-focus ui-tabs-selected ui-state-active';
var selectedQuiz, sBishopSquare1, sBishopSquare2;

$(document).ready(function () {


    fnHover(':button');
    fnHover('.spHeaderButtons');
    var divChessBoard = $('#divChessBoard');
    var ddlSpeed = $('#ddlSpeed');

    for (ranks = 8; ranks > 0; ranks--) {
        str+= '<div>';
        fnReverseColors();
        for (files = 0, charCodeStart = 97; files < 8, charCodeStart <= 104; files++, charCodeStart++) {

            if (files % 2 === 0)
                str += '<span class="' + color1 + '" color="' + color1 + '" id="' + String.fromCharCode(charCodeStart) + ranks + '"></span>';
            else
                str += '<span class="' + color2 + '" color="' + color2 + '" id="' + String.fromCharCode(charCodeStart) + ranks + '"></span>';
            arrSquares.push(String.fromCharCode(charCodeStart) + ranks); //Build an array of squares with Chess notation.

        }
        str += '</div>';
    }
    divChessBoard.append(str);

    function fnReverseColors() { //This function reverses the square colors for each alternating row.
        if (ranks % 2 === 0) {
            color1 = 'white';
            color2 = 'black';
        }
        else {
            color1 = 'black';
            color2 = 'white';
        }

    }
    $('span', '#divChessBoard').click(function () {
        $('span').removeClass('highlight');
        $(this).addClass('highlight');
        $('#spBoardMessage').html($(this).attr('id'));
    });

    //    $('span', '#divChessBoard').each(function(index, objSpan) {
    //        console.log(index, objSpan.id);
    //    });


    $('#ddlSpeed').change(function () {
        if (ddlSpeed.val() != 'select') {
            speed = ddlSpeed.val() * 1000;
        }
    });

    $('#chkShowBoard').click(function () {
        if ($(this).attr('checked'))
            divChessBoard.slideDown();
        else
            divChessBoard.slideUp();
    });


    $('#btnWhite').attr('disabled', true);
    $('#btnBlack').attr('disabled', true);

    $('#btnNextQuestion').click(function () {
        if (ddlSpeed.val() != 'select') {
            speed = ddlSpeed.val() * 1000;

            if (selectedQuiz == 'ColorOfSquares') {
                fnShowQuestionSquareColor(); //Show square color question
            }
            else if (selectedQuiz == 'Bishops') {
                fnShowQuestionBishops(); //Show bishops color question
            }
            else {
                alert('Please select a quiz');
            }

            $(this).html('Next Question');
            $('#btnWhite').attr('disabled', false);
            $('#btnBlack').attr('disabled', false);

            $('#btnYes').attr('disabled', false);
            $('#btnNo').attr('disabled', false);
        }
        else
            alert('Please select speed');
    });

    $('input[name="rdbGroupSelectQuiz"]').change(function () {
        selectedQuiz = $('input[name="rdbGroupSelectQuiz"]:checked').val();
        if (selectedQuiz == 'ColorOfSquares') {
            $('#spButtonsWhiteBlack').css('display', 'inline-block');
            $('#spButtonsYesNo').css('display', 'none');
        }
        else if (selectedQuiz == 'Bishops') {
            $('#spButtonsYesNo').css('display', 'inline-block');
            $('#spButtonsWhiteBlack').css('display', 'none');
        }
    });

    $('#btnWhite').click(function () {
        var color = $(this).attr('color');
        fnCheckAnswer(color);
    });

    $('#btnBlack').click(function () {
        var color = $(this).attr('color');
        fnCheckAnswer(color);
    });


    $('#btnYes').click(function () {
        var answer = $(this).attr('attrAnswer');
        fnCheckAnswerDiagonal(answer);
    });

    $('#btnNo').click(function () {
        var answer = $(this).attr('attrAnswer');
        fnCheckAnswerDiagonal(answer);
    });


    $(':button').click(function () {
        fnHighlight(':button', this);
    });


    $('.spHeaderButtons').click(function () {
        fnReset();
        $('#btnNextQuestion').html('Show Question');
        fnHighlight('span', this);
    });

});


function fnCheckAnswerDiagonal(userAnswer) {

    var actualAnswer = fnIsOnSameDiagonal(sBishopSquare1, sBishopSquare2);
    //        alert(userAnswer + actualAnswer);

    var correctAnswer = false;
    var strSameDiagonal = '';

    if (userAnswer != null) {
        if (userAnswer === actualAnswer.toString()) {
            correctAnswer = true;
            $('#divAnswer').html('You are correct! ').removeAttr('class').addClass('green');
            if(actualAnswer==false)
                strSameDiagonal = ' <b>NOT</b> on the same diagonal';
            else
                strSameDiagonal = ' on the same diagonal';
            score += 10;
            fnShowScore(score, correctAnswer);
        }
        else {
            correctAnswer = false;
            $('#divAnswer').html('Sorry! You are wrong. ').removeAttr('class').addClass('red');
            if (actualAnswer == false)
                strSameDiagonal = ' <b>NOT</b> on the same diagonal';
            else
                strSameDiagonal = ' on the same diagonal'; score -= 5;
            fnShowScore(score);
        }
        $('#divAnswer').append('The squares <b>' + sBishopSquare1 + '</b>' + ' and <b>' + sBishopSquare2 + '</b> are' + strSameDiagonal);

    }
    else {
        correctAnswer = false;
        $('#divAnswer').html('Time up! ').removeAttr('class').addClass('red');
        $('#lblTimer').html('0 sec');
        score -= 5;
        fnShowScore(score);
    }
    clearTimeout(timeOutID);
    clearInterval(timerID);
    //Display answer
    $('#btnYes').attr('disabled', true);
    $('#btnNo').attr('disabled', true);
    $('#'+sBishopSquare1).addClass('highlight');
    $('#'+sBishopSquare2).addClass('highlight');

}

function fnHover(element) {
    $(element).hover(
        function() {
            $(this).addClass('ui-state-hover');
        },
        function() {
            $(this).removeClass('ui-state-hover');
        }
    );
}

function fnHighlight(element, obj) {
    $(element).removeClass(btnClickAddClass);
    $(obj).addClass(btnClickAddClass);
}
function fnReset() {
    $('#divQuestion').html('');
    $('#divAnswer').html('');
    $('#spBoardMessage').html('');
    $('#lblTimer').html('');
    $(':button').removeClass(btnClickAddClass);
    $('span').removeClass('highlight');
    clearTimeout(timeOutID);
    clearInterval(timerID);
}
function fnShowQuestionSquareColor() {
    var square = fnPickRandomSquare();
    fnReset();  
    timer = $('#ddlSpeed').val();
    $('#lblTimer').html(timer+ ' sec');   
    $('#divQuestion').html('What is the color of the square <span class="spQuestion">' + square + '</span> ?');
    //clearInterval(timerID);
    timerID = setInterval("fnShowTimer()", 1000);
    //If user answers before time, his answer is passed to fnCheckAnswser. Else null is passed, which reduces his score.
    timeOutID = setTimeout("fnCheckAnswer(" + null + ")", speed); 
}

function fnCheckAnswer(answeredColor) {
    var actualColor = $('#' + arrSquares[index]).attr('color');
    var correctAnswer = false;
    if (answeredColor != null) {
        if (answeredColor === actualColor) {
            correctAnswer = true;
            $('#divAnswer').html('You are correct! ').removeAttr('class').addClass('green');
            score += 10;
            fnShowScore(score,correctAnswer);
        }
        else {
            correctAnswer = false;
            $('#divAnswer').html('Sorry! You are wrong. ').removeAttr('class').addClass('red');
            score -= 5;
            fnShowScore(score);
        }
    }
    else 
    {
        correctAnswer = false;
        $('#divAnswer').html('Time up! ').removeAttr('class').addClass('red');
        $('#lblTimer').html('0 sec');
        score -= 5;
        fnShowScore(score);
    }
    clearTimeout(timeOutID);
    clearInterval(timerID);
    //Display answer
    $('#btnWhite').attr('disabled', true);
    $('#btnBlack').attr('disabled', true);
    $('#divAnswer').append('The color of ' + arrSquares[index]+ ' is: <b>' + $('#' + arrSquares[index]).addClass('highlight').attr('color') + '</b>');

}




function fnShowScore(newScore,correctAnswer) {
    var cssClass='';
    if(newScore <= 0)
        cssClass = 'red';
    else
        cssClass = 'green';
    $('#spScore').html('You have scored: <b>' + newScore + '</b> points.').removeAttr('class').addClass(cssClass);
    if (correctAnswer == true && newScore > 0 && newScore % 100 === 0) {
        alert('Hello champ! You are rocking. Keep up the good work!!');
    }
}

function fnPickRandomSquare() {
    index = Math.floor(Math.random() * arrSquares.length);
    return arrSquares[index];
}

function fnShowTimer() {
    timer -= 1;
    $('#lblTimer').html(timer + ' sec');
}

function fnShowQuestionBishops() {

    sBishopSquare1 = fnPickRandomSquare();
    var newIndex;
    var randomIndex = Math.floor(Math.random() * 10);
    if (randomIndex > 5) {
        sBishopSquare2 = fnPickSquareOnSameDiagonal(sBishopSquare1);
//        console.log('same diagonal question');
    }
    else {   
        newIndex = Math.floor(Math.random() * arrSquares.length);
        sBishopSquare2 = arrSquares[newIndex];
//        console.log('random diagonal question');
    }

    fnReset();    
    timer = $('#ddlSpeed').val();
    $('#lblTimer').html(timer + ' sec');
    $('#divQuestion').html('Are the squares <span class="spQuestion">' + sBishopSquare1 + '</span> and <span class="spQuestion">' + sBishopSquare2 + '</span> on the same diagonal ?');
    //clearInterval(timerID);
    timerID = setInterval("fnShowTimer()", 1000);
    //If user answers before time, his answer is passed to fnCheckAnswser. Else null is passed, which reduces his score.
    timeOutID = setTimeout("fnCheckAnswerDiagonal(" + null + ")", speed);

}

function fnPickSquareOnSameDiagonal(sBishopSquare1) {

    /*Begin - Code for picking square on same diagonal*/
    var newSquare = '';
    var diff = 0;
    var randomInt = Math.floor(Math.random() * 4);
    
    var alphaAscii = (sBishopSquare1.charCodeAt(0));
    var num = sBishopSquare1.substring(1);
    var newAlphaAscii = alphaAscii + randomInt;
    var newNum = parseInt(num) + randomInt;

   
    
    diff = newAlphaAscii - alphaAscii;

    if (newAlphaAscii > 104) {
        newAlphaAscii = Math.abs(alphaAscii - diff);
        //document.write('<br/>Diff= '+diff+ '<br/>NewAlphaAscii= '+ newAlphaAscii);
    }
    if (newNum > 8) {
        newNum = Math.abs(num - diff);

    }
//    console.log(sBishopSquare1 + randomInt);
//    console.log(alphaAscii+' '+ newAlphaAscii + ' ' + newNum);
    
    var newAlpha = String.fromCharCode(newAlphaAscii);
    newSquare = newAlpha + parseInt(newNum);

    if(sBishopSquare1 === newSquare)
        return fnPickSquareOnSameDiagonal(sBishopSquare1);
    return newSquare;
    /*End - Code for picking square on same diagonal*/

}

function fnIsOnSameDiagonal(square1, square2) {
    var alphaAscii1 = (square1.charCodeAt(0));
    var num1 = square1.substring(1);
    
    var alphaAscii2 = (square2.charCodeAt(0));
    var num2 = square2.substring(1);

    if (Math.abs(num1 - num2) == Math.abs(alphaAscii1 - alphaAscii2))
        return true;
    else
        return false;
}