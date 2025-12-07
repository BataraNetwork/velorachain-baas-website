import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  Code,
  Wallet,
  Settings,
  Bell,
  LogOut,
  Key,
  Database,
  Zap,
  Shield,
  Copy,
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Demo data
  const stats = [
    { 
      title: 'Total Transactions', 
      value: '12,345', 
      change: '+12%',
      icon: Activity,
      color: 'text-blue-600'
    },
    { 
      title: 'API Calls Today', 
      value: '8,901', 
      change: '+5%',
      icon: Code,
      color: 'text-green-600'
    },
    { 
      title: 'Active Contracts', 
      value: '23', 
      change: '+2',
      icon: Database,
      color: 'text-purple-600'
    },
    { 
      title: 'Total Volume', 
      value: '$45.2K', 
      change: '+18%',
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  const recentTransactions = [
    { id: 'tx_001', type: 'Token Transfer', amount: '1,500 USDC', status: 'Completed', time: '2 min ago' },
    { id: 'tx_002', type: 'Contract Deploy', amount: '0.05 ETH', status: 'Pending', time: '5 min ago' },
    { id: 'tx_003', type: 'NFT Mint', amount: '0.1 ETH', status: 'Completed', time: '12 min ago' },
    { id: 'tx_004', type: 'Token Swap', amount: '500 USDT', status: 'Completed', time: '25 min ago' },
    { id: 'tx_005', type: 'Staking Reward', amount: '25 VLR', status: 'Completed', time: '1 hour ago' }
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/v1/contracts/deploy', description: 'Deploy smart contract' },
    { method: 'GET', path: '/api/v1/wallets/{address}/balance', description: 'Get wallet balance' },
    { method: 'POST', path: '/api/v1/transactions/send', description: 'Send transaction' },
    { method: 'GET', path: '/api/v1/transactions/{hash}', description: 'Get transaction details' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        setIsAuthenticated(true);
        toast({
          title: "Welcome to VeloraChain Dashboard!",
          description: "You're now logged in to the demo environment.",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ email: '', password: '' });
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <CardTitle className="text-2xl font-bold">VeloraChain Dashboard</CardTitle>
            <p className="text-gray-600">Login to access your demo environment</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="demo@velorachain.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter any password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login to Demo'}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                <strong>Demo Credentials:</strong><br />
                Email: Any valid email format<br />
                Password: Any text
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <Badge variant="secondary">Demo Environment</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's what's happening with your blockchain applications today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from yesterday</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="api">API & Keys</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 5).map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{tx.type}</p>
                          <p className="text-sm text-gray-500">{tx.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{tx.amount}</p>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={tx.status === 'Completed' ? 'default' : 'secondary'}
                              className={tx.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {tx.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{tx.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                    <Code className="w-4 h-4 mr-2" />
                    Deploy Smart Contract
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="w-4 h-4 mr-2" />
                    Create New Wallet
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Send Transaction
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.type}</p>
                          <p className="text-sm text-gray-500">{tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{tx.amount}</p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={tx.status === 'Completed' ? 'default' : 'secondary'}
                            className={tx.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {tx.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{tx.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle>Smart Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'VeloraToken (ERC20)', address: '0x1234...5678', status: 'Active', deployed: '2 days ago' },
                    { name: 'NFT Collection', address: '0x5678...9012', status: 'Active', deployed: '1 week ago' },
                    { name: 'Staking Contract', address: '0x9012...3456', status: 'Pending', deployed: '3 hours ago' }
                  ].map((contract, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contract.name}</p>
                          <p className="text-sm text-gray-500">{contract.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={contract.status === 'Active' ? 'default' : 'secondary'}
                          className={contract.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {contract.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{contract.deployed}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API & Keys Tab */}
          <TabsContent value="api">
            <div className="space-y-6">
              {/* API Keys */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>API Keys</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/api-keys')}>
                    Manage All Keys <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Production API Key</span>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">
                        {showApiKey ? 'vlr_live_1234567890abcdef1234567890abcdef' : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('vlr_live_1234567890abcdef1234567890abcdef')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/api-keys')}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Full API Key Management
                  </Button>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-sm text-gray-600">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600">Interactive charts would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">120ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium text-green-600">99.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-medium">1,234,567</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Error Rate</span>
                      <span className="font-medium text-red-600">0.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}