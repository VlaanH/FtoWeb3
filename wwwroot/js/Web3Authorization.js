const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let web3Modal


let provider;

let Accounts;



window.userAddress = null;
window.onload = async () => {


    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options:
                {
                    rpc:
                        {
                            80001: "https://matic-mumbai.chainstacklabs.com",
                            137: 'https://matic-mainnet.chainstacklabs.com'
                        },
                    infuraId: 'cfce162043954f298110b0fdf9a8edb6',
                },
            display:
                {
                    description: "Scan with a wallet to connect",
                },
        },
    };
    web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions
    });

    // Init Web3 connected to ETH network
    await LoginWithEth();
    if (window.web3!==undefined)
    {
        if (SmartContractVersion==null)
            SmartContractVersion=parseInt(LatestSmartContractVersion);

    }

    if (typeof (initPage) === "function")
    {
        initPage();
    }


};


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

    hidden("web3Net",false);
    hidden("logoutButton",false);

    hidden("btnLoginWithEth",true);

    await SetNetName();

}


async function Logout()
{
    await web3Modal.clearCachedProvider();
    provider = null;
    window.userAddress=null;
    window.localStorage.removeItem("userAddress");

    if (window.web3.eth.currentProvider.disconnect!==undefined)
    {
        window.web3.eth.currentProvider.disconnect();
    }
    InitContract();

    await ShowWeb3NetAndAccount();
    RefreshAjaxPage();
}

function initProviderEvents()
{
    provider.on("accountsChanged", async () =>
    {
        await LoginWithEth();

    });
    provider.on("chainChanged", async () =>
    {
        await ShowWeb3NetAndAccount();
    });
}

async function LoginWithEth()
{

    let previousAccount = window.userAddress;

    provider = await web3Modal.connect();
    window.web3 = new Web3(provider);
    Accounts = await web3.eth.getAccounts();

    if (window.web3)
    {

        try
        {
            window.userAddress = Accounts[0];
            initProviderEvents();

            await ShowWeb3NetAndAccount();
        }
        catch (error)
        {
            console.error(error);
        }

    }

    InitContract();
    if (previousAccount!==null && previousAccount!==window.userAddress)
    {
        RefreshAjaxPage();
    }

}