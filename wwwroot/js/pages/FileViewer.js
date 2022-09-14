var ResultDiv = document.getElementById("manFileViewer");

var SizeFile = document.getElementById("SizeFile");

var Extension = document.getElementById("Extension");

var FileName = document.getElementById("FileName");

var DownloadButton = document.getElementById("DownloadButton");



async function SetFileToView(fileId) 
{
    var fileBase64 = await Web3GetFile(fileId);
    
    var extension = GetExtension(fileBase64);
    
    ResultDiv.append(getHTMLElementByExtension(fileBase64,extension));
    
    SizeFile.innerText = getFileSize(fileBase64);
    
    Extension.innerHTML = extension.toUpperCase();


    DownloadButton.addEventListener("click", ()=>
    {
        downloadBase64(fileBase64,"test",extension)
    });
}

function getHTMLElementByExtension(fileBase64,extension) 
{
    switch (extension.toUpperCase()) 
    {
        case "JPG":
        case "PNG":
        case "GIF":
        case "JPEG":
        {
            var img=document.createElement("img");
            
            img.src=fileBase64;
            img.classList="imageFile rounded-root";
            
            return img;
        }
        case "PDF":
        {
            var style = "width: 100%;height: 100%;";
            var obj = document.createElement("object");
            obj.data=fileBase64;
            obj.type="application/pdf";
            obj.classList="padding-root";
            obj.style=style;

            var iframe = document.createElement("iframe");
            iframe.src=fileBase64;
            iframe.style = style;
            iframe.classList="rounded-root";

            obj.append(iframe);
            return obj;
        }
        default:
        {
            var p = document.createElement("p");
            p.innerText="File";
            
            return p;
        }

    }
    
    
}


function getFileSize(fileBase64) 
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

