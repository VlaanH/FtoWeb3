var ResultImage = document.getElementById("ResultImage");

var SizeFile = document.getElementById("SizeFile");

var Extension = document.getElementById("Extension");

var FileName = document.getElementById("FileName");



async function SetFileToView(fileId) 
{
    var fileBase64 = await Web3GetFile(fileId);
   // resultTextarea.innerHTML=fileBase64;
    ResultImage.src = fileBase64;
    
    SizeFile.innerText = GetFileSize(fileBase64);
    
    // SizeFile.innerHTML = fileBase64.size();
    Extension.innerHTML = GetExtension(fileBase64).toUpperCase();
}


function GetFileSize(fileBase64) 
{
    var byte = new Blob([fileBase64]).size;

    var num = 1024.00; //1-KByte

    if (byte < num)
        return byte + "B";
    
    if (byte < Math.pow(num, 2))
        return (byte / num).toFixed(2) + "K"; 
    
    if (byte < Math.pow(num, 3))
        return (byte / Math.pow(num, 2)).toFixed(2) + "M"; 
    
    if (byte < Math.pow(num, 4))
        return (byte / Math.pow(num, 3)).toFixed(2) + "G";
    
    return (byte / Math.pow(num, 4)).toFixed(2) + "T"; 

    
}