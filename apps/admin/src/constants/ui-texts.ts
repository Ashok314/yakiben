export const UI_TEXTS = {
  settings: {
    title: "Settings",
    restaurantInfoTab: "Restaurant Info",
    settingsTab: "Settings",
    restaurantInfo: {
      title: "Restaurant Info",
      editButton: "Edit",
      nameLabel: "Name",
      addressLabel: "Address",
      phoneLabel: "Phone",
      emailLabel: "Email",
      saveButton: "Save Restaurant Info",
    },
    restaurantSettings: {
      title: "Restaurant Settings",
      editButton: "Edit",
      openingTimeLabel: "Opening Time",
      closingTimeLabel: "Closing Time",
      minAdvanceTimeLabel: "Minimum Advance Time (Hours)",
      maxAdvanceDaysLabel: "Maximum Advance Days",
      businessDaysLabel: "Business Days",
      saveButton: "Save Restaurant Settings",
    },
    orderingEnabled: {
      label: "Ordering Enabled",
      enableButton: "Enable Ordering (Currently Offline)",
      disableButton: "Disable Ordering (Currently Online)",
    },
    confirmDialogs: {
      saveRestaurantInfo: {
        title: "Save Restaurant Info",
        message: "Are you sure you want to save the restaurant info?",
      },
      saveRestaurantSettings: {
        title: "Save Restaurant Settings",
        message: "Are you sure you want to save the restaurant settings?",
      },
      changeOrderingStatus: {
        title: "Change Ordering Status",
        enableMessage: "Are you sure you want to enable ordering?",
        disableMessage: "Are you sure you want to disable ordering?",
      },
    },
  },
  userManagement: {
    title: "User Management",
    description: "Manage users and roles here.",
    tableHeaders: {
      name: "Name",
      email: "Email",
      role: "Role",
      actions: "Actions",
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
      addNewUser: "Add New User",
    },
    modals: {
      editUser: {
        title: "Edit User",
        fields: {
          name: "Name",
          email: "Email",
          role: "Role",
        },
        buttons: {
          cancel: "Cancel",
          save: "Save",
        },
      },
      deleteUser: {
        title: "Confirm Delete",
        message: "Are you sure you want to delete this user?",
      },
    },
  },
  menuManagement: {
    title: "Menu Management",
    description: "Manage your restaurant's menu items here.",
    tableHeaders: {
      name: "Name",
      price: "Price",
      description: "Description",
      outOfStock: "Out of Stock",
      actions: "Actions",
    },
    itemStatus: {
      outOfStock: "Out of Stock",
      available: "Available",
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
      addNewItem: "Add New Item",
    },
    modals: {
      editItem: {
        title: "Edit Item",
      },
      addItem: {
        title: "Add Item",
      },
      form: {
        nameLabel: "Name",
        priceLabel: "Price",
        categoryLabel: "Category",
        addNewCategory: "Add New Category",
        newCategoryPlaceholder: "Enter new category",
        addCategoryButton: "Add Category",
        descriptionLabel: "Description",
        imageUrlLabel: "Image URL",
        outOfStockLabel: "Out of Stock",
        cancelButton: "Cancel",
        saveButton: "Save",
      },
      confirmDialogs: {
        save: {
          title: "Confirm Save",
          message: "Are you sure you want to save changes?",
        },
        delete: {
          title: "Confirm Delete",
          message: "Are you sure you want to delete this item?",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          message: "You have unsaved changes. Are you sure you want to close?",
        },
      },
    },
  },
  orders: {
    title: "Orders",
    hideDeliveredLabel: "Hide Delivered",
    hideNonTodayLabel: "Hide Non-Today",
    hideDeliveringLabel: "Hide Delivering",
    hideDeliveredAndDeliveringLabel: "Hide Delivered and Delivering", // Added hideDeliveredAndDeliveringLabel
    filterLabel: "Filter by Date",
    kanban: {
      orderDetails: {
        trackingId: "Tracking ID",
        customerName: "Customer Name",
        scheduledAt: "Scheduled At",
        total: "Total",
      },
      buttons: {
        prevStatus: "Previous Status",
        nextStatus: "Next Status",
        print: "Print",
      },
    },
    modal: {
      title: "Order Details",
      customerInfo: {
        title: "Customer Information",
        name: "Name",
        phone: "Phone",
      },
      orderInfo: {
        orderId: "Order ID",
        scheduledAt: "Scheduled At",
      },
      items: {
        title: "Items",
        headers: {
          index: "#",
          item: "Item",
          quantity: "Quantity",
          price: "Price",
        },
        total: "Total",
      },
      comments: {
        title: "Comments",
      },
    },
  },
  account: {
    title: "Account",
    userInfo: {
      name: "Name",
      email: "Email",
      role: "Role",
    },
    logoutButton: "Logout",
    updateButton: "Update",
    cancelButton: "Cancel",
    editingText: "Edit",
    updateSuccessMessage: "User information updated successfully!",
    confirmEditTitle: "Confirm Edit",
    confirmEditMessage: "Are you sure you want to save changes to your account information?",
    confirmUpdateTitle: "Confirm Update",
    confirmUpdateMessage: "Are you sure you want to update your account information?",
  },
  orderSummary: {
    title: "Order Summary",
    quickFilterLabel: "Quick Filter",
    filterLabel: "Filter by Date Range",
    groupByLabel: "Group By",
    headers: {
      date: "Date",
      totalOrders: "Total Orders",
      totalRevenue: "Total Revenue",
    },
    groupByOptions: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
    },
    quickFilters: {
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      all: "All",
    },
  },
};
