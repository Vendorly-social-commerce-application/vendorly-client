"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Filter,
  PackageCheck,
  Search,
  ShoppingBag,
  Store,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orderService } from "@/app/services/order.service";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/types/order";
import OrderDetailsModal from "@/components/orders/OrderDetailModal";
import VendorlyLogoLink from "@/components/layout/VendorlyLogoLink";
import { toast } from "sonner";

type OrderStatusFilter = Order["status"] | "ALL";
type OrderTypeFilter = Order["type"] | "ALL";

interface MyOrdersPageProps {
  embedded?: boolean;
  title?: string;
  subtitle?: string;
}

const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getProductName = (order: Order): string => {
  return order.orderItems?.[0]?.product?.name || "Unknown Product";
};

const getOrderTotal = (order: Order): number => {
  if (order.totalAmount) return order.totalAmount;

  return (
    order.orderItems?.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.price || item.product?.price || 0;
      return sum + quantity * price;
    }, 0) || 0
  );
};

const getSellerName = (order: Order) => {
  return order.vendor?.storeName || order.vendorName || "Vendor";
};

const getStatusLabel = (status: Order["status"]) => {
  switch (status) {
    case "PAID":
      return "Paid, awaiting delivery";
    case "DELIVERED":
      return "Delivered, awaiting your confirmation";
    case "COMPLETED":
      return "Completed";
    case "PENDING":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const getStatusClassName = (status: Order["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "PAID":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "DELIVERED":
      return "border-purple-100 bg-purple-50 text-purple-700";
    case "PENDING":
      return "border-amber-100 bg-amber-50 text-amber-700";
    case "CANCELLED":
      return "border-rose-100 bg-rose-50 text-rose-700";
    default:
      return "border-gray-100 bg-gray-50 text-gray-700";
  }
};

const getStatusDotClassName = (status: Order["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-500";
    case "PAID":
      return "bg-blue-500";
    case "DELIVERED":
      return "bg-purple-500";
    case "PENDING":
      return "bg-amber-500";
    case "CANCELLED":
      return "bg-rose-500";
    default:
      return "bg-gray-400";
  }
};

const OrderStatusBadge = ({ status }: { status: Order["status"] }) => (
  <span
    className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
      status,
    )}`}
  >
    <span
      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${getStatusDotClassName(
        status,
      )}`}
    />
    <span className="truncate">{getStatusLabel(status)}</span>
  </span>
);

const OrderTypeBadge = ({ type }: { type: Order["type"] }) => (
  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
    {type === "CHECKOUT" ? "Checkout" : "WhatsApp"}
  </span>
);

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  className: string;
}) => (
  <Card className="overflow-hidden border-gray-100 shadow-sm">
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${className}`}>
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);

const MyOrdersSkeleton = ({ embedded = false }: { embedded?: boolean }) => (
  <div
    className={
      embedded
        ? "space-y-6"
        : "min-h-screen bg-gradient-to-b from-[#f9fafb] via-white to-[#f9fafb]"
    }
  >
    <div className={embedded ? "" : "container mx-auto px-4 py-8 sm:px-6 lg:px-8"}>
      <div className="mb-6 h-32 rounded-xl bg-gray-100 animate-pulse" />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
      <div className="h-96 rounded-xl bg-gray-100 animate-pulse" />
    </div>
  </div>
);

export default function MyOrdersPage({
  embedded = false,
  title = "My Orders",
  subtitle = "Track your purchases and confirm received checkout orders.",
}: MyOrdersPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<OrderTypeFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !embedded) {
      router.replace("/login");
    }
  }, [embedded, isAuthenticated, isLoading, router]);

  const purchasesQuery = useQuery({
    queryKey: ["my-purchases", statusFilter, typeFilter, currentPage, pageSize],
    queryFn: () =>
      orderService.getMyPurchases({
        status: statusFilter,
        type: typeFilter,
        page: currentPage,
        limit: pageSize,
      }),
    enabled: isAuthenticated,
  });

  const orders = purchasesQuery.data?.orders || [];
  const pagination = purchasesQuery.data?.pagination;

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return orders;

    return orders.filter((order) => {
      return (
        getProductName(order).toLowerCase().includes(normalizedSearch) ||
        getSellerName(order).toLowerCase().includes(normalizedSearch) ||
        order.id.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [orders, searchTerm]);

  const totalOrders = pagination?.total || filteredOrders.length;
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "COMPLETED",
  ).length;
  const paidOrders = filteredOrders.filter((order) => order.status === "PAID").length;
  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === "DELIVERED",
  ).length;
  const totalPages = pagination?.pages || Math.ceil(filteredOrders.length / pageSize) || 1;
  const currentRangeStart = totalOrders ? (currentPage - 1) * pageSize + 1 : 0;
  const currentRangeEnd = Math.min(currentPage * pageSize, totalOrders);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as OrderStatusFilter);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value as OrderTypeFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!embedded) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmReceived = async (order: Order) => {
    setConfirmingOrderId(order.id);
    try {
      await orderService.confirmCompletion(order.id);
      toast.success("Order completed successfully");
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      await purchasesQuery.refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to confirm order completion",
      );
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const renderAction = (order: Order) => {
    if (order.type === "CHECKOUT" && order.status === "DELIVERED") {
      return (
        <Button
          size="sm"
          className="bg-[#10b981] text-white hover:bg-[#059669]"
          disabled={confirmingOrderId === order.id}
          onClick={() => handleConfirmReceived(order)}
        >
          <PackageCheck className="mr-2 h-4 w-4" />
          {confirmingOrderId === order.id ? "Confirming..." : "Confirm Received"}
        </Button>
      );
    }

    return <span className="text-sm text-gray-500">No action</span>;
  };

  const renderMobileOrderCard = (order: Order) => (
    <Card
      key={order.id}
      className="border-gray-100 shadow-sm active:scale-[0.99] transition-transform"
    >
      <CardContent className="space-y-4 p-4">
        <button
          type="button"
          onClick={() => handleOrderClick(order)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-gray-500">
                  #{order.id.slice(-8)}
                </span>
                <OrderTypeBadge type={order.type} />
              </div>
              <h3 className="mt-2 line-clamp-2 text-base font-semibold text-gray-900">
                {getProductName(order)}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Seller: {getSellerName(order)}
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3">
          <div>
            <p className="text-xs font-medium text-gray-500">Date</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500">Amount</p>
            <p className="mt-1 text-sm font-bold text-[#10b981]">
              {formatCurrency(getOrderTotal(order))}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <OrderStatusBadge status={order.status} />
          <div onClick={(event) => event.stopPropagation()}>{renderAction(order)}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading || purchasesQuery.isLoading) {
    return <MyOrdersSkeleton embedded={embedded} />;
  }

  const content = (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="relative w-full lg:max-w-sm"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products, sellers, or order ID..."
              className="h-11 w-full rounded-lg border-gray-200 bg-white pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 bg-white">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter === "ALL" ? "All Status" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("ALL")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("PAID")}>
                  Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("DELIVERED")}>
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("COMPLETED")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("CANCELLED")}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 bg-white">
                  <Filter className="mr-2 h-4 w-4" />
                  {typeFilter === "ALL" ? "All Types" : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleTypeChange("ALL")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeChange("CHECKOUT")}>
                  Checkout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeChange("WHATSAPP")}>
                  WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          className="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          title="Paid"
          value={paidOrders}
          icon={CreditCard}
          className="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          title="Ready To Confirm"
          value={deliveredOrders}
          icon={PackageCheck}
          className="bg-purple-50 text-purple-600"
        />
        <SummaryCard
          title="Completed"
          value={completedOrders}
          icon={CheckCircle}
          className="bg-amber-50 text-amber-600"
        />
      </div>

      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Purchase history
            </h2>
            <p className="text-sm text-gray-500">
              {totalOrders} {totalOrders === 1 ? "order" : "orders"} found
            </p>
          </div>
          {purchasesQuery.isFetching && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Refreshing
            </div>
          )}
        </div>

        <CardContent className="p-0">
          {filteredOrders.length > 0 ? (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-gray-50/80">
                      <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Product
                      </TableHead>
                      <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Seller
                      </TableHead>
                      <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Date
                      </TableHead>
                      <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Amount
                      </TableHead>
                      <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Status
                      </TableHead>
                      <TableHead className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer border-gray-100 transition-colors hover:bg-emerald-50/30"
                        onClick={() => handleOrderClick(order)}
                      >
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                              <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-semibold text-gray-900">
                                  #{order.id.slice(-8)}
                                </span>
                                <OrderTypeBadge type={order.type} />
                              </div>
                              <p className="mt-1 max-w-[280px] truncate text-sm text-gray-500">
                                {getProductName(order)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="font-medium text-gray-900">
                            {getSellerName(order)}
                          </div>
                          <div className="text-xs text-gray-500">Store</div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="px-5 py-4 font-semibold text-gray-900">
                          {formatCurrency(getOrderTotal(order))}
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 text-right"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {renderAction(order)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {filteredOrders.map(renderMobileOrderCard)}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Store className="h-7 w-7 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-900">No orders found</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {searchTerm || statusFilter !== "ALL" || typeFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "Products you buy from vendors will appear here."}
              </p>
            </div>
          )}
        </CardContent>

        {filteredOrders.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:px-6">
            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <span className="whitespace-nowrap text-sm text-gray-500">
                Showing {currentRangeStart} to {currentRangeEnd} of {totalOrders}{" "}
                orders
              </span>
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-gray-500 sm:inline">Show</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value: string) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="hidden text-sm text-gray-500 sm:inline">
                  per page
                </span>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-1 sm:w-auto sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <span className="px-3 text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              >
                <ChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          showFullDetailsButton={false}
        />
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] via-white to-[#f9fafb]">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <VendorlyLogoLink className="mb-6" />
        {content}
      </div>
    </div>
  );
}
