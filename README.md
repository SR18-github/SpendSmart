# SpendSmart - Personal Finance Manager

SpendSmart is a **React Native** mobile application designed to help users manage their personal finances efficiently. Users can **track income and expenses**, categorize transactions, and generate insightful financial reports.

Requirements:
Create a program that helps students manage their personal finances by tracking account
balances, income and expenses. The program should allow users to input details about their
income sources and expenses, including the amount, category, and date of each transaction.
It should provide features to view the current balance, generate summaries of income and
expenses over specified periods (e.g., weekly, monthly), and categorize expenses to show
spending patterns. Additionally, the program should include functionality to update or delete
existing entries and offer search and filter options to easily find specific transactions.


## Features

- **Multi-Platform**: App that can run on iOS or Android devices.
- **Add and Manage Transactions**: Users can add income and expenses with a category, date, and comment.
- **Transaction History**: View and delete past transactions.
- **Categorized Reports**: Filter transactions by date, category, or amount.
- **Graphical Insights**: Pie charts and reports for better financial understanding.
- **Persistent Data Storage**: Uses SQLite for offline data storage.

---

## Application Architecture

Below is the **high-level architecture** of the application:



### **Overview:**

1. **React Native UI** - User interacts with the mobile app.
2. **Transaction Context API** - Manages state and transactions.
3. **Database Module (SQLite)** - Handles database operations.
4. **Persistent Storage (Expo SQLite)** - Stores transactions and categories permanently.

---

## Database Schema

The application uses an SQLite database to store financial data. Below is the **Entity Relationship Diagram (ERD):**



### **Tables:**

- **Transactions** (id, type, amount, category\_id, date, comment)
- **Categories** (id, name)
- **Users** (id, name, email)

---

## Technologies Used

- **React Native** - Frontend UI framework.
- **Expo** - React Native framework for easy development.
- **SQLite** - Local database storage.
- **@react-native-picker/picker** - Dropdown picker component.
- **@react-native-community/datetimepicker** - Date selection.
- **react-native-chart-kit** - For generating financial graphs.

---

## Getting Started

### ** 1. Clone the Repository**

```sh
$ git clone https://github.com/yourusername/spendsmart.git
$ cd spendsmart
```

### ** 2. Install Dependencies**

```sh
$ npm install
```

### ** 3. Start the Development Server**

```sh
$ npx expo start
```

Install Expo Go App from the AppStore and scan the QR code using **Expo Go** on your mobile device.

---

