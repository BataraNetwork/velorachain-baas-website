import { ethers } from 'ethers';
import { SUPPORTED_CHAINS, type SupportedChain, type ChainConfig } from './chains';

export interface Web3ProviderConfig {
  chain: SupportedChain;
  apiKey?: string;
}

export class Web3Service {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private currentChain: ChainConfig | null = null;

  constructor(config?: Web3ProviderConfig) {
    if (config) {
      this.initialize(config);
    }
  }

  async initialize(config: Web3ProviderConfig) {
    try {
      const chainConfig = SUPPORTED_CHAINS[config.chain];
      if (!chainConfig) {
        throw new Error(`Unsupported chain: ${config.chain}`);
      }

      const rpcUrl = config.apiKey 
        ? chainConfig.rpcUrl.replace('demo', config.apiKey)
        : chainConfig.rpcUrl;

      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.currentChain = chainConfig;

      // Test connection
      await this.provider.getNetwork();
      console.log(`Connected to ${chainConfig.name}`);
    } catch (error) {
      console.error('Failed to initialize Web3 service:', error);
      throw error;
    }
  }

  async connectWallet(): Promise<ethers.Signer | null> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await provider.getSigner();
      
      return this.signer;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const tokenABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)'
      ];

      const contract = new ethers.Contract(tokenAddress, tokenABI, this.provider);
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw error;
    }
  }

  async estimateGas(transaction: any): Promise<{ gasLimit: bigint; gasPrice: bigint; totalCost: string }> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const gasLimit = await this.provider.estimateGas(transaction);
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      
      const totalCost = ethers.formatEther(gasLimit * gasPrice);

      return {
        gasLimit,
        gasPrice,
        totalCost
      };
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  async sendTransaction(transaction: any): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.signer.sendTransaction(transaction);
      return tx;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  async deployContract(abi: any[], bytecode: string, constructorArgs: any[] = []) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const factory = new ethers.ContractFactory(abi, bytecode, this.signer);
      const contract = await factory.deploy(...constructorArgs);
      await contract.waitForDeployment();
      
      return contract;
    } catch (error) {
      console.error('Failed to deploy contract:', error);
      throw error;
    }
  }

  async getContract(address: string, abi: any[]): Promise<ethers.Contract> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return new ethers.Contract(address, abi, this.signer || this.provider);
  }

  async switchChain(chainId: number): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      throw error;
    }
  }

  getCurrentChain(): ChainConfig | null {
    return this.currentChain;
  }

  getProvider(): ethers.JsonRpcProvider | null {
    return this.provider;
  }

  getSigner(): ethers.Signer | null {
    return this.signer;
  }
}

// Global instance
export const web3Service = new Web3Service();