
function VersionSmartContractObj()
{
    this.ABI;

    this.CONTRACT_ADDRESS;
}


var SmartContractVersion;

var contractObj;


function InitContract()
{

    let ftoWeb3Obj = eval("FtoWeb3V"+SmartContractVersion);
    
    contractObj = new ftoWeb3Obj();

    console.log(contractObj.version)
}



async function Web3CrateFile(id,fileName,parts)
{
    let blockSize = SizeSlider.value;
    
    await contractObj.CrateFile(id, fileName, blockSize, parts);
    
    await FileStatusSet(FileInput);
}
async function Web3FileUpload(id,base64Data,partId)
{
    await contractObj.FileUpload(id,base64Data,partId);
    
    await FileStatusSet(FileInput);
}
async function Web3GetFile(id)
{
    return contractObj.GetFile(id);
}
async function Web3GetPartsLoaded(id)
{
    return contractObj.GetPartsLoaded(id);
}
async function Web3FileExist(id)
{
    return contractObj.FileExist(id);
}

async function Web3GetBlockSize(id)
{
    return contractObj.GetBlockSize(id);
}
async function Web3GetFileName(id)
{
    return contractObj.GetFileName(id);
}

async function Web3GetFileSize(id,base64=null)
{
    let intSize = await contractObj.GetFileSize(base64,id);
    
    return fileSizeNormalization(intSize);
}

async function Web3GetFilePart(id,partId)
{
    return contractObj.GetFilePart(id,partId);
}

async function Web3GetJsonFileMap(id)
{
    return contractObj.GetJsonFileMap(id);
}
