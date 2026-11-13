"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Building,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { dataService } from "@/lib/services/dataService";
import { Wallet, Transaction, WithdrawalRequest } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export default function WalletPage() {
  const currentUser = dataService.getCurrentUser();
  const [wallet, setWallet] = useState<Wallet>(dataService.getWallet(currentUser.id));
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Modals state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | "">(50);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");
  const [withdrawMethod, setWithdrawMethod] = useState("Bank Transfer (ACH)");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const loadData = () => {
    setWallet(dataService.getWallet(currentUser.id));
    setTransactions(dataService.getTransactions(currentUser.id));
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  // Handle Deposit (Stripe sandbox simulation)
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;

    dataService.depositFunds(currentUser.id, Number(depositAmount));
    setDepositSuccess(true);
    setTimeout(() => {
      setIsDepositModalOpen(false);
      setDepositSuccess(false);
      loadData();
    }, 1200);
  };

  // Handle Withdrawal
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setWithdrawError("Enter a valid withdrawal amount.");
      return;
    }
    if (Number(withdrawAmount) > wallet.withdrawable_balance) {
      setWithdrawError("Requested amount exceeds your available withdrawable balance.");
      return;
    }
    if (!accountNumber) {
      setWithdrawError("Please provide your account details.");
      return;
    }

    try {
      dataService.requestWithdrawal(
        currentUser.id,
        Number(withdrawAmount),
        withdrawMethod,
        {
          bank_name: bankName || "Student Credit Union",
          account_number_last4: accountNumber.slice(-4),
        }
      );
      setWithdrawSuccess(true);
      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(false);
        loadData();
      }, 1200);
    } catch (err: any) {
      setWithdrawError(err.message || "Withdrawal failed.");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Student Wallet & Earnings
            </h1>
            <Badge variant="purple" className="text-xs">
              Sandbox Mode
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time balance breakdown, escrow holdings, transaction history, and payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => setIsDepositModalOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm font-semibold"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Funds</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="gap-2 font-semibold"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Withdraw Payout</span>
          </Button>
        </div>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <Card className="border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Balance
              </span>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(wallet.available_balance)}
            </div>
            <p className="text-[11px] text-slate-500">
              Usable for funding orders or direct withdrawal
            </p>
          </CardContent>
        </Card>

        {/* Pending Escrow */}
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Escrow
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600">
              {formatCurrency(wallet.pending_balance)}
            </div>
            <p className="text-[11px] text-slate-500">
              Held in contracts pending buyer approval
            </p>
          </CardContent>
        </Card>

        {/* Total Lifetime Earnings */}
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lifetime Earnings
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {formatCurrency(wallet.total_earnings)}
            </div>
            <p className="text-[11px] text-slate-500">
              Total gross earnings from completed projects
            </p>
          </CardContent>
        </Card>

        {/* Withdrawable Balance */}
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Withdrawable
              </span>
              <Building className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-3xl font-extrabold text-purple-600">
              {formatCurrency(wallet.withdrawable_balance)}
            </div>
            <p className="text-[11px] text-slate-500">
              Ready for ACH transfer or PayPal payout
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Security Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm">Transparent 5% Student Fee Policy</div>
            <div className="text-xs text-slate-400">
              SkillConnect only takes 5% on completed milestones. Zero deposit fees, zero hidden card processing markups.
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Immutable Transaction Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Every deposit, milestone earning, platform fee, and withdrawal is cryptographically recorded.
            </p>
          </div>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold tracking-wider">
                  <th className="pb-3 pl-2">Type</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Fee</th>
                  <th className="pb-3 pr-2 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 pl-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          tx.type === "earning" || tx.type === "deposit"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : tx.type === "withdrawal"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {tx.type === "earning" || tx.type === "deposit" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-400">
                      {tx.reference_id || "TX_SYS"}
                    </td>
                    <td className="py-3.5 text-slate-500">{formatDate(tx.created_at)}</td>
                    <td className="py-3.5 text-right text-slate-400">
                      {tx.fee > 0 ? `-${formatCurrency(tx.fee)}` : "$0.00"}
                    </td>
                    <td
                      className={`py-3.5 pr-2 text-right font-bold text-sm ${
                        tx.type === "earning" || tx.type === "deposit"
                          ? "text-emerald-600"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {tx.type === "earning" || tx.type === "deposit" ? "+" : "-"}
                      {formatCurrency(tx.net_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No transactions recorded in ledger.
          </div>
        )}
      </div>

      {/* Deposit Modal (Stripe Sandbox) */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Deposit Funds (Sandbox Simulation)"
        description="Top up your wallet to fund project escrow for tasks and proposals."
      >
        {depositSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Deposit Confirmed!</h3>
            <p className="text-xs text-slate-500">
              ${depositAmount} has been credited to your available balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Amount to Deposit ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="5"
                  step="5"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Test Visa Card</span>
                </span>
                <span className="font-mono">•••• 4242</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Sandbox Mode active. No real credit card charge will occur.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsDepositModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Confirm Deposit
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Withdrawal Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Request Payout Withdrawal"
        description="Transfer your earnings to your collegiate checking account or PayPal."
      >
        {withdrawSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Withdrawal Dispatched</h3>
            <p className="text-xs text-slate-500">
              Your payout request has been registered and is processing via ACH bank transfer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawal} className="space-y-4 mt-2">
            {withdrawError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                {withdrawError}
              </div>
            )}

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-xs text-purple-900 dark:text-purple-300 flex justify-between items-center">
              <span>Withdrawable Balance:</span>
              <strong className="text-sm font-bold">{formatCurrency(wallet.withdrawable_balance)}</strong>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Withdrawal Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="10"
                  max={wallet.withdrawable_balance}
                  required
                  placeholder="50"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Payout Rail
              </label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-sm"
              >
                <option value="Bank Transfer (ACH)">Bank Transfer (ACH Direct Deposit)</option>
                <option value="PayPal">PayPal Instant Payout</option>
                <option value="Debit Card Fast Transfer">Debit Card Fast Transfer</option>
              </select>
            </div>

            <Input
              label="Bank / Institution Name"
              placeholder="e.g. Stanford Federal Credit Union"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <Input
              label="Routing / Account Number"
              required
              placeholder="•••• •••• •••• 8821"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsWithdrawModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                Confirm Withdrawal
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
