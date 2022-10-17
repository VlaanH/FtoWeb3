var ResultDiv = document.getElementById("manFileViewer");

var SizeFile = document.getElementById("SizeFile");

var Extension = document.getElementById("Extension");

var FileName = document.getElementById("FileName");

var DownloadButton = document.getElementById("DownloadButton");



async function SetFileToView(fileId) 
{
    var fileName = await Web3GetFileName(fileId);
    
    FileName.innerText=normalizeName(fileName,8);
    
    FileName.title=fileName;

    
    var fileBase64 = await Web3GetFile(fileId);

    var extension = GetExtension(fileBase64);

    SizeFile.innerText = await Web3GetFileSize(fileId,fileBase64);

    ResultDiv.innerHTML = null;
    ResultDiv.append(getHTMLElementByExtension(fileBase64,extension));
    
    Extension.innerText = extension.toUpperCase();
    

    DownloadButton.addEventListener("click", ()=>
    {
        downloadBase64(fileBase64,fileName);
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

