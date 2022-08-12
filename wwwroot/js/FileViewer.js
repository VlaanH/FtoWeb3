
var resultTextarea = document.getElementById("ResultTextarea");

var resultImage = document.getElementById("ResultImage");

async function SetFileToView(fileId) 
{
    var fileBase64 = await Web3GetFile(fileId);
    resultTextarea.innerHTML=fileBase64;
    resultImage.src = fileBase64;
}


