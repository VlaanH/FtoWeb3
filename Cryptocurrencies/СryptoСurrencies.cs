using System.Threading.Tasks;

namespace FtoWeb3.Cryptocurrencies
{
    public abstract class Cryptocurrencies
    {
        public abstract string webUrl { get; set; }
        public abstract Task<string> GetBalance(string publicAddress);
        public abstract CurrenciesKeyObject GenerateAddress();
    }
}