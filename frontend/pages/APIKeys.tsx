import { useState, useEffect } from "react";
import backend from "~backend/client";
import type { APIKeyListItem } from "~backend/apikeys/list";
import type { APIKeyResponse } from "~backend/apikeys/generate";
import type { UsageResponse } from "~backend/apikeys/usage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Key, Copy, Trash2, RefreshCw, Eye, EyeOff, Plus, TrendingUp } from "lucide-react";

const AVAILABLE_SCOPES = [
  { value: "*", label: "Full Access", description: "Access to all endpoints" },
  { value: "contracts:read", label: "Contracts Read", description: "Read contract data" },
  { value: "contracts:write", label: "Contracts Write", description: "Create and deploy contracts" },
  { value: "wallets:read", label: "Wallets Read", description: "Read wallet data" },
  { value: "wallets:write", label: "Wallets Write", description: "Create and manage wallets" },
  { value: "transactions:read", label: "Transactions Read", description: "Read transaction data" },
  { value: "transactions:write", label: "Transactions Write", description: "Submit transactions" },
  { value: "tokens:read", label: "Tokens Read", description: "Read token data" },
  { value: "tokens:write", label: "Tokens Write", description: "Mint and manage tokens" },
];

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKeyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyData, setNewKeyData] = useState<APIKeyResponse | null>(null);
  const [selectedKeyUsage, setSelectedKeyUsage] = useState<{ keyId: string; data: UsageResponse } | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    scopes: [] as string[],
    rate_limit_per_minute: "",
    rate_limit_per_hour: "",
    rate_limit_per_day: "",
    expires_in_days: "",
  });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const userId = "user_123";
      const response = await backend.apikeys.list({ user_id: userId });
      setKeys(response.keys);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    try {
      const userId = "user_123";
      const expiresAt = formData.expires_in_days
        ? new Date(Date.now() + parseInt(formData.expires_in_days) * 24 * 60 * 60 * 1000)
        : undefined;

      const response = await backend.apikeys.generate({
        user_id: userId,
        name: formData.name,
        scopes: formData.scopes,
        rate_limit_per_minute: formData.rate_limit_per_minute ? parseInt(formData.rate_limit_per_minute) : undefined,
        rate_limit_per_hour: formData.rate_limit_per_hour ? parseInt(formData.rate_limit_per_hour) : undefined,
        rate_limit_per_day: formData.rate_limit_per_day ? parseInt(formData.rate_limit_per_day) : undefined,
        expires_at: expiresAt,
      });

      setNewKeyData(response);
      setFormData({
        name: "",
        scopes: [],
        rate_limit_per_minute: "",
        rate_limit_per_hour: "",
        rate_limit_per_day: "",
        expires_in_days: "",
      });
      loadKeys();
      toast({
        title: "Success",
        description: "API key generated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    }
  };

  const rotateKey = async (keyId: string) => {
    try {
      const userId = "user_123";
      const response = await backend.apikeys.rotate({ key_id: keyId, user_id: userId });
      setNewKeyData(response);
      loadKeys();
      toast({
        title: "Success",
        description: "API key rotated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to rotate API key",
        variant: "destructive",
      });
    }
  };

  const revokeKey = async (keyId: string) => {
    try {
      const userId = "user_123";
      await backend.apikeys.revoke({ key_id: keyId, user_id: userId });
      loadKeys();
      toast({
        title: "Success",
        description: "API key revoked successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const loadUsage = async (keyId: string) => {
    try {
      const response = await backend.apikeys.usage({ key_id: keyId });
      setSelectedKeyUsage({ keyId, data: response });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load usage data",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope],
    }));
  };

  const isKeyExpired = (expiresAt?: Date) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Key className="w-10 h-10" />
              API Key Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate, rotate, and manage your API keys with custom scopes and rate limits
            </p>
          </div>
          <Button onClick={() => setShowNewKeyDialog(!showNewKeyDialog)} className="gap-2">
            <Plus className="w-4 h-4" />
            Generate New Key
          </Button>
        </div>

        {showNewKeyDialog && (
          <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Generate New API Key</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Production API Key"
                />
              </div>

              <div>
                <Label>Scopes / Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {AVAILABLE_SCOPES.map(scope => (
                    <div
                      key={scope.value}
                      onClick={() => toggleScope(scope.value)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        formData.scopes.includes(scope.value)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 border-2 rounded ${
                            formData.scopes.includes(scope.value)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground"
                          }`}
                        />
                        <span className="font-medium">{scope.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{scope.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rate_minute">Rate Limit (per minute)</Label>
                  <Input
                    id="rate_minute"
                    type="number"
                    value={formData.rate_limit_per_minute}
                    onChange={e => setFormData({ ...formData, rate_limit_per_minute: e.target.value })}
                    placeholder="60"
                  />
                </div>
                <div>
                  <Label htmlFor="rate_hour">Rate Limit (per hour)</Label>
                  <Input
                    id="rate_hour"
                    type="number"
                    value={formData.rate_limit_per_hour}
                    onChange={e => setFormData({ ...formData, rate_limit_per_hour: e.target.value })}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="rate_day">Rate Limit (per day)</Label>
                  <Input
                    id="rate_day"
                    type="number"
                    value={formData.rate_limit_per_day}
                    onChange={e => setFormData({ ...formData, rate_limit_per_day: e.target.value })}
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expires">Expires In (days)</Label>
                <Input
                  id="expires"
                  type="number"
                  value={formData.expires_in_days}
                  onChange={e => setFormData({ ...formData, expires_in_days: e.target.value })}
                  placeholder="365"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave empty for no expiration
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateKey}
                  disabled={!formData.name || formData.scopes.length === 0}
                  className="flex-1"
                >
                  Generate API Key
                </Button>
                <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {newKeyData && (
          <Card className="p-6 bg-primary/5 border-primary">
            <h3 className="text-xl font-bold mb-4 text-primary">New API Key Generated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Make sure to copy your API key now. You won't be able to see it again!
            </p>
            <div className="flex items-center gap-3 bg-background p-4 rounded-lg">
              <code className="flex-1 font-mono text-sm break-all">{newKeyData.key}</code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(newKeyData.key)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setNewKeyData(null)} className="mt-4 w-full">
              I've saved my key
            </Button>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your API Keys</h2>
          {keys.length === 0 ? (
            <Card className="p-8 text-center">
              <Key className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No API keys yet. Generate one to get started!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {keys.map(key => (
                <Card key={key.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold">{key.name}</h3>
                          {!key.is_active && <Badge variant="destructive">Revoked</Badge>}
                          {isKeyExpired(key.expires_at) && <Badge variant="destructive">Expired</Badge>}
                          {key.is_active && !isKeyExpired(key.expires_at) && (
                            <Badge variant="default">Active</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {key.key_prefix}••••••••
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadUsage(key.id)}
                          title="View Usage"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rotateKey(key.id)}
                          disabled={!key.is_active}
                          title="Rotate Key"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => revokeKey(key.id)}
                          disabled={!key.is_active}
                          title="Revoke Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(key.created_at).toLocaleDateString()}</p>
                      </div>
                      {key.expires_at && (
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-medium">{new Date(key.expires_at).toLocaleDateString()}</p>
                        </div>
                      )}
                      {key.last_used_at && (
                        <div>
                          <p className="text-muted-foreground">Last Used</p>
                          <p className="font-medium">{new Date(key.last_used_at).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Scopes</p>
                        <p className="font-medium">{key.scopes.join(", ")}</p>
                      </div>
                    </div>

                    {(key.rate_limit_per_minute || key.rate_limit_per_hour || key.rate_limit_per_day) && (
                      <div className="flex gap-4 text-sm">
                        {key.rate_limit_per_minute && (
                          <div>
                            <p className="text-muted-foreground">Rate Limit / Min</p>
                            <p className="font-medium">{key.rate_limit_per_minute}</p>
                          </div>
                        )}
                        {key.rate_limit_per_hour && (
                          <div>
                            <p className="text-muted-foreground">Rate Limit / Hour</p>
                            <p className="font-medium">{key.rate_limit_per_hour}</p>
                          </div>
                        )}
                        {key.rate_limit_per_day && (
                          <div>
                            <p className="text-muted-foreground">Rate Limit / Day</p>
                            <p className="font-medium">{key.rate_limit_per_day}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedKeyUsage?.keyId === key.id && (
                      <div className="border-t pt-4">
                        <h4 className="font-bold mb-3">Usage Statistics (Last 30 Days)</h4>
                        <p className="text-sm mb-3">
                          <span className="font-medium">Total Requests:</span> {selectedKeyUsage.data.total_requests}
                        </p>
                        {selectedKeyUsage.data.endpoints.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Top Endpoints:</p>
                            {selectedKeyUsage.data.endpoints.slice(0, 5).map((endpoint, idx) => (
                              <div key={idx} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                                <span>{endpoint.endpoint}</span>
                                <span className="font-medium">{endpoint.count} requests</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
