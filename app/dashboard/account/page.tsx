"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, Hash } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import AccountSkeleton from "@/components/profile/AccountSkeleton";
import { bankService, BankOption, VendorBankAccount } from "@/app/services/bank.service";
import { toast } from "sonner";

const AccountPage = () => {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [formData, setFormData] = useState<VendorBankAccount>({
    bankName: "",
    accountNumber: 0,
    bankCode: "",
    currency: "NGN",
  });

  const loadBankData = useCallback(async () => {
    setIsLoadingData(true);
    let bankOptions: BankOption[] = [];

    try {
      bankOptions = await bankService.getBanks();
      setBanks(bankOptions);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to load supported banks. Please try again.",
      );
    }

    try {
      const accountData = await bankService.getMyBankAccount();
      const selectedBank = bankOptions.find(
        (bank) => bank.name === accountData.bankName,
      );

      setFormData({
        bankName: accountData.bankName || selectedBank?.name || "",
        bankCode: accountData.bankCode || selectedBank?.code || "",
        accountNumber: accountData.accountNumber || 0,
        currency: accountData.currency || "NGN",
      });
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to load your bank account details.",
        );
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadBankData();
  }, [loadBankData]);

  const handleFormChange = useCallback(
    (field: keyof VendorBankAccount, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const filteredBanks = useMemo(
    () =>
      banks.filter((bank) =>
        bank.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
        bank.code.includes(bankSearch),
      ),
    [banks, bankSearch],
  );

  const handleBankSelect = useCallback(
    (bankName: string) => {
      const selectedBank = banks.find((bank) => bank.name === bankName);
      setBankSearch("");
      setFormData((prev) => ({
        ...prev,
        bankName,
        bankCode: selectedBank?.code || "",
      }));
    },
    [banks],
  );

  const handleSave = async () => {
    if (!formData.bankName || !formData.accountNumber) {
      toast.error("Please complete your bank name and account number.");
      return;
    }

    setIsSaving(true);
    try {
      await bankService.saveMyBankAccount(formData);
      toast.success("Bank account details saved successfully.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to save bank account details. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isProfileLoading || isLoadingData) {
    return <AccountSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl">Account unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We could not load your account. Please login again or refresh the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bank Account Details</h1>
            <p className="text-muted-foreground mt-1">
              Add or update your bank payout account for vendor settlements.
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Bank Details"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payout account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                  <Banknote className="h-4 w-4" /> Select Bank
                </label>
                <Select value={formData.bankName} onValueChange={handleBankSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        placeholder="Search banks by name or code"
                        className="w-full"
                      />
                    </div>
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <SelectItem key={bank.code} value={bank.name}>
                          {bank.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No banks match your search.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                  <Banknote className="h-4 w-4" /> Account Number
                </label>
                <Input
                  type="number"
                  value={formData.accountNumber}
                  onChange={(e) => handleFormChange("accountNumber", parseInt(e.target.value) )}
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                  <Banknote className="h-4 w-4" /> Currency
                </label>
                <Select value={formData.currency} onValueChange={(value) => handleFormChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                  <Hash className="h-4 w-4" /> Bank Code
                </label>
                <Input
                  value={formData.bankCode}
                  readOnly
                  placeholder="Selected bank code"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
