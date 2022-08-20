var ResultImage = document.getElementById("ResultImage");

var SizeFile = document.getElementById("SizeFile");

var Extension = document.getElementById("Extension");

var FileName = document.getElementById("FileName");

var DownloadButton = document.getElementById("DownloadButton");



async function SetFileToView(fileId) 
{
    var fileBase64 = await Web3GetFile(fileId);
    
    var extension = GetExtension(fileBase64);
    
    ResultImage.src = fileBase64;
    
    SizeFile.innerText = GetFileSize(fileBase64);
    
    Extension.innerHTML = extension.toUpperCase();


    DownloadButton.addEventListener("click", ()=>
    {
        downloadBase64(fileBase64,"test",extension)
    });
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

