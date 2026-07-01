"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrder } from "@/hooks/useOrder";
import { orderService } from "@/app/services/order.service";
import {
  Search,
  Filter,
  ShoppingBag,
  MoreVertical,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PackageCheck,
  Truck,
  CreditCard,
} from "lucide-react";
import { Order } from "@/types/order";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import UpdateOrderModal from "@/components/orders/UpdateOrderModal";
import OrderDetailsModal from "@/components/orders/OrderDetailModal";
import { toast } from "sonner";

// Format currency
const formatCurrency = (amount: number = 0) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get product name from order items
const getProductName = (order: Order): string => {
  if (order.orderItems && order.orderItems.length > 0) {
    return order.orderItems[0]?.product?.name || "Unknown Product";
  }
  return "Unknown Product";
};

// Calculate order total
const getOrderTotal = (order: Order): number => {
  if (order.totalAmount) {
    return order.totalAmount;
  }
  if (order.orderItems && order.orderItems.length > 0) {
    return order.orderItems.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = item.price || item.product?.price || 0;
      return sum + quantity * price;
    }, 0);
  }
  return 0;
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

const getSellerName = (order: Order) => {
  return order.vendor?.storeName || order.vendorName || "Vendor";
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

const OrdersPage = () => {
  const {
    orders,
    getVendorOrders,
    isFetchingOrders,
    deleteOrder,
    markDelivered,
    confirmCompletion,
  } = useOrder();
  const { user } = useSelector((state: RootState) => state.auth);
  const isVendor = user?.role === "VENDOR";
  const [activeView, setActiveView] = useState<"sales" | "purchases">(
    isVendor ? "sales" : "purchases",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "ALL">(
    "ALL",
  );
  const [typeFilter, setTypeFilter] = useState<Order["type"] | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [markingDeliveredOrderId, setMarkingDeliveredOrderId] = useState<
    string | null
  >(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setActiveView(isVendor ? "sales" : "purchases");
  }, [isVendor]);

  useEffect(() => {
    if (isVendor) {
      getVendorOrders();
    }
  }, [isVendor]);

  const myPurchasesQuery = useQuery({
    queryKey: [
      "my-purchases",
      statusFilter,
      typeFilter,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      orderService.getMyPurchases({
        status: statusFilter,
        type: typeFilter,
        page: currentPage,
        limit: pageSize,
      }),
    enabled: activeView === "purchases",
  });

  const purchaseOrders = myPurchasesQuery.data?.orders || [];
  const purchasePagination = myPurchasesQuery.data?.pagination;

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    const sourceOrders = activeView === "purchases" ? purchaseOrders : orders;
    if (!sourceOrders) return [];

    return sourceOrders.filter((order: Order) => {
      const productName = getProductName(order);
      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSellerName(order).toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        activeView === "purchases" ||
        statusFilter === "ALL" ||
        order.status === statusFilter;
      const matchesType =
        activeView === "sales" || typeFilter === "ALL" || order.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [activeView, orders, purchaseOrders, searchTerm, statusFilter, typeFilter]);

  // Paginate orders
  const paginatedOrders = useMemo(() => {
    if (activeView === "purchases") {
      return filteredOrders;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [activeView, filteredOrders, currentPage, pageSize]);

  // Calculate total pages
  const totalPages =
    activeView === "purchases"
      ? purchasePagination?.pages || Math.ceil(filteredOrders.length / pageSize)
      : Math.ceil(filteredOrders.length / pageSize);

  // Stats
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(
    (o) => o.status === "COMPLETED",
  ).length;
  const pendingOrders = filteredOrders.filter(
    (o) => o.status === "PENDING",
  ).length;
  const cancelledOrders = filteredOrders.filter(
    (o) => o.status === "CANCELLED",
  ).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as Order["status"] | "ALL");
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value as Order["type"] | "ALL");
    setCurrentPage(1);
  };

  const handleViewChange = (view: "sales" | "purchases") => {
    setActiveView(view);
    setCurrentPage(1);
    setSearchTerm("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateClick = (order: Order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = () => {
    // Refresh orders after update
    getVendorOrders();
  };

  // handleUpdate function
  const handleUpdate = (order: Order) => {
    handleUpdateClick(order);
  };

  const handleDelete = async (order: Order) => {
    setDeletingOrderId(order.id);
    try {
      await deleteOrder(order.id);
      toast.success("Order deleted successfully", { position: "top-center" });
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleMarkDelivered = async (order: Order) => {
    setMarkingDeliveredOrderId(order.id);
    try {
      await markDelivered(order.id);
      await getVendorOrders();
    } catch {
      // Friendly backend error is handled in useOrder.
    } finally {
      setMarkingDeliveredOrderId(null);
    }
  };

  const handleConfirmReceived = async (order: Order) => {
    setConfirmingOrderId(order.id);
    try {
      await confirmCompletion(order.id);
      await myPurchasesQuery.refetch();
    } catch {
      // Friendly backend error is handled in useOrder.
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Row click handler
  const handleRowClick = (order: Order) => {
    setSelectedOrderForDetails(order);
    setIsDetailsModalOpen(true);
  };

  // Details modal close handler
  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrderForDetails(null);
  };

  const isInitialLoading =
    activeView === "purchases"
      ? myPurchasesQuery.isLoading && !purchaseOrders.length
      : isFetchingOrders && !orders?.length;

  if (isInitialLoading) {
    return <OrdersPageSkeleton />;
  }

  const pageTitle = isVendor
    ? activeView === "sales"
      ? "Orders"
      : "My Purchases"
    : "My Purchases";
  const pageSubtitle =
    activeView === "sales"
      ? "Manage and track sales from your customers"
      : "Track products you bought from other vendors";
  const totalOrderCount =
    activeView === "purchases"
      ? purchasePagination?.total || filteredOrders.length
      : filteredOrders.length;
  const currentRangeStart = totalOrderCount
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const currentRangeEnd = Math.min(currentPage * pageSize, totalOrderCount);
  const paidOrders = filteredOrders.filter((o) => o.status === "PAID").length;
  const deliveredOrders = filteredOrders.filter(
    (o) => o.status === "DELIVERED",
  ).length;
  const isActiveFetching =
    activeView === "purchases" ? myPurchasesQuery.isFetching : isFetchingOrders;

  const renderOrderAction = (order: Order) => {
    const isThisOrderDeleting = deletingOrderId === order.id;

    if (activeView === "sales") {
      return (
        <div className="flex flex-wrap justify-end gap-2">
          {order.type === "CHECKOUT" && order.status === "PAID" && (
            <Button
              size="sm"
              className="bg-[#10b981] text-white hover:bg-[#059669]"
              disabled={markingDeliveredOrderId === order.id}
              onClick={() => handleMarkDelivered(order)}
            >
              <Truck className="h-4 w-4 mr-2" />
              {markingDeliveredOrderId === order.id
                ? "Marking..."
                : "Mark as Delivered"}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isThisOrderDeleting}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {order.status === "PENDING" && (
                <DropdownMenuItem
                  onClick={() => handleUpdate(order)}
                  disabled={isThisOrderDeleting}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Update
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleDelete(order)}
                className="text-destructive"
                disabled={isThisOrderDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isThisOrderDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    if (order.type === "CHECKOUT" && order.status === "DELIVERED") {
      return (
        <Button
          size="sm"
          className="bg-[#10b981] text-white hover:bg-[#059669]"
          disabled={confirmingOrderId === order.id}
          onClick={() => handleConfirmReceived(order)}
        >
          <PackageCheck className="h-4 w-4 mr-2" />
          {confirmingOrderId === order.id ? "Confirming..." : "Confirm Received"}
        </Button>
      );
    }

    return <span className="text-sm text-muted-foreground">No action</span>;
  };

  const renderMobileOrderCard = (order: Order) => {
    const partyName =
      activeView === "sales"
        ? order.customerName || "Anonymous"
        : getSellerName(order);

    return (
      <Card
        key={order.id}
        className="border-gray-100 shadow-sm active:scale-[0.99] transition-transform"
      >
        <CardContent className="space-y-4 p-4">
          <button
            type="button"
            onClick={() => handleRowClick(order)}
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
                  {activeView === "sales" ? "Customer" : "Seller"}: {partyName}
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
            <div onClick={(e) => e.stopPropagation()}>{renderOrderAction(order)}</div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] via-white to-[#f9fafb]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {pageTitle}
                  </h1>
                  <p className="text-sm text-gray-500">{pageSubtitle}</p>
                </div>
              </div>
            </div>

            {isVendor && (
              <div className="inline-flex w-full rounded-lg border border-gray-200 bg-gray-50 p-1 sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleViewChange("sales")}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                    activeView === "sales"
                      ? "bg-white text-[#10b981] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sales
                </button>
                <button
                  type="button"
                  onClick={() => handleViewChange("purchases")}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                    activeView === "purchases"
                      ? "bg-white text-[#10b981] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Purchases
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/60 p-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={handleSearch} className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="h-11 w-full rounded-lg border-gray-200 bg-white pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 bg-white">
                    <Filter className="h-4 w-4 mr-2" />
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
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("DELIVERED")}
                  >
                    Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("COMPLETED")}
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("CANCELLED")}
                  >
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {activeView === "purchases" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 bg-white">
                      <Filter className="h-4 w-4 mr-2" />
                      {typeFilter === "ALL" ? "All Types" : typeFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleTypeChange("ALL")}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleTypeChange("CHECKOUT")}
                    >
                      Checkout
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTypeChange("WHATSAPP")}>
                      WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          <SummaryCard
            title="Total"
            value={totalOrders}
            icon={ShoppingBag}
            className="bg-emerald-50 text-emerald-600"
          />
          <SummaryCard
            title="Completed"
            value={completedOrders}
            icon={CheckCircle}
            className="bg-blue-50 text-blue-600"
          />
          <SummaryCard
            title={activeView === "sales" ? "Paid" : "Delivered"}
            value={activeView === "sales" ? paidOrders : deliveredOrders}
            icon={activeView === "sales" ? CreditCard : PackageCheck}
            className="bg-purple-50 text-purple-600"
          />
          <SummaryCard
            title="Needs Attention"
            value={pendingOrders + cancelledOrders}
            icon={Clock}
            className="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Orders Table */}
        <Card className="overflow-hidden border-gray-100 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {activeView === "sales" ? "Sales orders" : "Purchase history"}
              </h2>
              <p className="text-sm text-gray-500">
                {totalOrderCount} {totalOrderCount === 1 ? "order" : "orders"}{" "}
                found
              </p>
            </div>
            {isActiveFetching && (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Refreshing
              </div>
            )}
          </div>

          <CardContent className="p-0">
            {paginatedOrders.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow className="hover:bg-gray-50/80">
                        <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                          Order
                        </TableHead>
                        <TableHead className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                          {activeView === "sales" ? "Customer" : "Seller"}
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
                      {paginatedOrders.map((order: Order) => {
                        const partyName =
                          activeView === "sales"
                            ? order.customerName || "Anonymous"
                            : getSellerName(order);
                        const isThisOrderDeleting = deletingOrderId === order.id;

                        return (
                          <TableRow
                            key={order.id}
                            className={`cursor-pointer border-gray-100 transition-colors hover:bg-emerald-50/30 ${
                              isThisOrderDeleting
                                ? "pointer-events-none bg-gray-50 opacity-50"
                                : ""
                            }`}
                            onClick={() =>
                              !isThisOrderDeleting && handleRowClick(order)
                            }
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
                                  <p className="mt-1 max-w-[260px] truncate text-sm text-gray-500">
                                    {getProductName(order)}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <div className="font-medium text-gray-900">
                                {partyName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {activeView === "sales" ? "Buyer" : "Store"}
                              </div>
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
                              onClick={(e) => e.stopPropagation()}
                            >
                              {renderOrderAction(order)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="grid gap-3 p-4 md:hidden">
                  {paginatedOrders.map(renderMobileOrderCard)}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingBag className="h-7 w-7 text-gray-400" />
                </div>
                <p className="font-semibold text-gray-900">No orders found</p>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  {searchTerm || statusFilter !== "ALL"
                    ? "Try adjusting your filters"
                    : activeView === "sales"
                      ? "When customers place orders, they'll appear here"
                      : "Your purchases will appear here after checkout"}
                </p>
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t">
              {/* Left side - Showing X to Y of Z orders & Page size selector */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Showing {currentRangeStart} to {currentRangeEnd} of{" "}
                  {totalOrderCount} orders
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Show
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value: string) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    per page
                  </span>
                </div>
              </div>

              {/* Right side - Pagination controls */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 w-full sm:w-auto">
                {/* First Page Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* Page Indicator - Mobile friendly */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Show first page on mobile if not too far */}
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="hidden sm:flex h-8 w-8 p-0"
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {/* Page numbers - responsive */}
                  {(() => {
                    const pages = [];
                    const maxVisible = window.innerWidth < 640 ? 3 : 5;
                    let startPage = Math.max(
                      1,
                      currentPage - Math.floor(maxVisible / 2),
                    );
                    let endPage = Math.min(
                      totalPages,
                      startPage + maxVisible - 1,
                    );

                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${
                            currentPage === i
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {i}
                        </Button>,
                      );
                    }
                    return pages;
                  })()}

                  {/* Show last page on mobile if not too far */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                          ...
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="hidden sm:flex h-8 w-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>

                {/* Last Page Button */}
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
      </div>

      {/* Update Order Modal */}
      {selectedOrder && (
        <UpdateOrderModal
          isOpen={isUpdateModalOpen}
          onClose={handleModalClose}
          order={selectedOrder}
          onUpdate={handleOrderUpdated}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrderForDetails && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleDetailsModalClose}
          order={selectedOrderForDetails}
        />
      )}
    </div>
  );
};

// Skeleton Loader
const OrdersPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    </header>

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-muted rounded animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        </div>
      </Card>
    </div>
  </div>
);

export default OrdersPage;
