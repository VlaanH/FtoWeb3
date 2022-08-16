window.userAddress = null;
window.onload = async () => {
    // Init Web3 connected to ETH network
    if (window.ethereum) 
    {
        window.web3 = new Web3(window.ethereum);
        // Load in Localstore key
        window.userAddress = window.localStorage.getItem("userAddress");
        await ShowWeb3NetAndAccount();
        
        window.ethereum.on('accountsChanged', function ()
        {
            loginWithEth(true);
           
        });
        window.ethereum.on('chainChanged', function()
        {
            ShowWeb3NetAndAccount();
        });
        InitContract();
       
    }

    if (typeof (initPage) === "function") 
    {
        initPage();
    }
  
 
};

function hidden(id,isHidden)
{
    try 
    {
        if (isHidden)
        {
            document.getElementById(id).classList.add("hidden");
        }
        else
        {
            document.getElementById(id).classList.remove("hidden");
        } 
    }
    catch (e) 
    {
        
    }
    
    
}

async function SetNetName() 
{
    var id = await web3.eth.net.getId();
    if (id===80001)
    {
        document.getElementById("web3NetName").innerText="Polygon mumbai";
        document.getElementById("web3NetImg").src="/img/polygon-.svg";
        
    }
    else if(id===137)
    {
        document.getElementById("web3NetName").innerText="Polygon mainnet"
        document.getElementById("web3NetImg").src="/img/polygon-.svg";
    }
    else 
    {
        document.getElementById("web3NetName").innerText="Not Polygon net"
        document.getElementById("web3NetImg").src="/img/X.png";
    }
}


async function ShowWeb3NetAndAccount() 
{
    if (!window.userAddress) 
    {
        hidden("web3Net",true);
        hidden("logoutButton",true);
       
        hidden("btnLoginWithEth",false);
        
        return false;
    }
    
    // document.getElementById("userAddress").innerText = `ETH Address: ${truncateAddress(window.userAddress)}`;
    hidden("web3Net",false);
    hidden("logoutButton",false);
    
    hidden("btnLoginWithEth",true);
   
    await SetNetName(await web3.eth.net.getId());

}


async function logout() 
{
    window.userAddress = null;
    window.localStorage.removeItem("userAddress");
    
    await ShowWeb3NetAndAccount();
    RefreshAjaxPage();
}


async function loginWithEth() 
{
    if (window.web3)
    {
        try 
        {
           
            const selectedAccount = await window.ethereum
                .request
                ({
                    method: "eth_requestAccounts",
                })
                .then((accounts) => accounts[0])
                .catch(() => 
                {
                    throw Error("No account selected!");
                });
            window.userAddress = selectedAccount;
            window.localStorage.setItem("userAddress", selectedAccount);
            await ShowWeb3NetAndAccount();
            
        } 
        catch (error) 
        {
            console.error(error);
        } 
        
        RefreshAjaxPage();
       
    } 
    else 
    {
       alert("MetaMask not installed.");
    }
}




const CONTRACT_ADDRESS = '0x0022D9875C0E080bcBeF93328a143dfF30E20306';
window.ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"base64Data","type":"string"},{"internalType":"uint256","name":"partId","type":"uint256"}],"name":"AddFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"fileName","type":"string"}],"name":"CreateFile","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"FileExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFile","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getFileSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"versions","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}]



var contract;
function InitContract()
{
    contract = new window.web3.eth.Contract(window.ABI, CONTRACT_ADDRESS);
}



async function Web3CrateFile(id,fileName)
{

    const symbol = await contract.methods.CreateFile(id,fileName).send({ from: window.userAddress});
    
    console.log(symbol);
    await FileStatusSet(FileInput);

}
async function Web3FileUpload(id,base64Data,partId)
{

    const symbol = await contract.methods.AddFile(id,base64Data,partId).send({ from: window.userAddress});
    

    console.log(symbol);
    await FileStatusSet(FileInput);
}
async function Web3GetFile(id)
{
    const symbol = await contract.methods.getFile(id).call();
    
    
    console.log(symbol);
    
    return symbol;
    
}
async function Web3GetFileSize(id)
{
    const symbol = await contract.methods.getFileSize(id).call();


    console.log(symbol);

    return symbol;

}
async function Web3FileExist(id)
{
    const symbol = await contract.methods.FileExist(id).call();
    
    console.log(symbol);
    
    
    return symbol;
    
}