"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Coins } from "lucide-react"
import { royaltyIncomeData, royaltyPayouts, dashboardStats } from "@/lib/mock-data"

const royaltyData = royaltyIncomeData
const payouts = royaltyPayouts

export default function Royalties() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Royalties</h1>
            <p className="text-muted-foreground">Track your royalty income and payouts.</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Coins size={18} />
            Claim Royalties
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Earned</p>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.totalEarned}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending Payout</p>
              <p className="text-2xl font-bold text-accent">{dashboardStats.pendingPayout}</p>
              <p className="text-xs text-muted-foreground mt-2">Available to claim</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Monthly Average</p>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.monthlyAverage}</p>
              <p className="text-xs text-muted-foreground mt-2">Last 6 months</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Royalty Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={royaltyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar dataKey="amount" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Property</TableHead>
                    <TableHead className="text-foreground">Amount</TableHead>
                    <TableHead className="text-foreground">Date</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id} className="border-border">
                      <TableCell className="text-foreground">{payout.property}</TableCell>
                      <TableCell className="text-foreground font-semibold">{payout.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{payout.date}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium">
                          {payout.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
