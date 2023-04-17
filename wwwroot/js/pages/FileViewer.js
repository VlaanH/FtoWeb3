var ResultDiv = document.getElementById("manFileViewer");

var SizeFile = document.getElementById("SizeFile");

var Extension = document.getElementById("Extension");

var FileName = document.getElementById("FileName");

var DownloadButton = document.getElementById("DownloadButton");



async function SetFileToView(fileId) 
{
    let fileName = await Web3GetFileName(fileId);
    
    FileName.innerText = normalizeName(fileName,8);
    
    FileName.title = fileName;


    let fileBase64 = await Web3GetFile(fileId);

    let extension = GetExtension(fileBase64);

    SizeFile.innerText = await Web3GetFileSize(fileId,fileBase64);

    ResultDiv.innerHTML = null;
    ResultDiv.append(await getHTMLElementByExtension(fileBase64,extension));
    
    Extension.innerText = extension.toUpperCase();
    

    DownloadButton.addEventListener("click", ()=>
    {
        downloadBase64(fileBase64,fileName);
    });
}

async function getHTMLElementByExtension(fileBase64,extension) 
{
    let style = "width: 100%;height: 100%;";
    switch (extension.toUpperCase()) 
    {
        case "JPG":
        case "PNG":
        case "GIF":
        case "JPEG":
        case "webp":
        {
            let img=document.createElement("img");
            
            img.src = fileBase64;
            img.classList = "imageFile rounded-root";
            
            return img;
        }
        case "PDF":
        {
            let obj = document.createElement("object");
            obj.data = fileBase64;
            obj.type = "application/pdf";
            obj.classList = "padding-root";
            obj.style = style;

            let iframe = document.createElement("iframe");
            iframe.src = fileBase64;
            iframe.style = style;
            iframe.classList = "rounded-root";

            obj.append(iframe);
            return obj;
        }
        case "MP4":
        {
            let video = document.createElement("video");
            video.classList = "padding-root";
            video.style = style;
            video.controls = true;

            let source = document.createElement("source");
            source.src = fileBase64;
            source.style = style;
            source.classList = "rounded-root";
            source.type = "video/mp4";
            
            
            video.append(source);
            return video;
            
        }
        case "MPEG":
        {
           let base64Cover = await getMpegCover(fileBase64);
           
            let div = document.createElement("div");
            div.style = "display: contents;";
            
            if (base64Cover != null)
            {
                let img = document.createElement("img");
                img.src = base64Cover;
                img.classList = "imageCover rounded-root";
                div.append(img);
            }
            
            let audio = document.createElement("audio");
            audio.classList = "padding-root position-absolute";
            audio.style = style+"height: 70px; bottom: 0;"
            audio.controls = true;

            let source = document.createElement("source");
            source.src = fileBase64;
            source.type = "audio/mpeg";
            audio.append(source);
            
            
            div.append(audio);
            return div;
        }
        default:
        {
            let p = document.createElement("p");
            p.innerText="File";
            
            return p;
        }

    }
    
    
}

