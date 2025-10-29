"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp } from "lucide-react"
import { userInvestments, dashboardStats } from "@/lib/mock-data"

const investments = userInvestments

export default function MyInvestments() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Investments</h1>
          <p className="text-muted-foreground">Track your investment portfolio and performance.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Invested</p>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.totalInvested}</p>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <TrendingUp size={14} /> +15.2% this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Current Value</p>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.currentValue}</p>
              <p className="text-xs text-green-400 mt-2">+$11,300 gain</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Average ROI</p>
              <p className="text-2xl font-bold text-green-400">{dashboardStats.averageROI}</p>
              <p className="text-xs text-muted-foreground mt-2">Across all investments</p>
            </CardContent>
          </Card>
        </div>

        {/* Investments Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Investment Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Property</TableHead>
                    <TableHead className="text-foreground">Shares</TableHead>
                    <TableHead className="text-foreground">Value</TableHead>
                    <TableHead className="text-foreground">ROI</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id} className="border-border">
                      <TableCell className="text-foreground">{investment.property}</TableCell>
                      <TableCell className="text-foreground">{investment.shares}</TableCell>
                      <TableCell className="text-foreground">{investment.value}</TableCell>
                      <TableCell className="text-green-400">{investment.roi}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium">
                          {investment.status}
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
