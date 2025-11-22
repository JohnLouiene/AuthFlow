## 1NF

> Users
- Id
- Username
- Password
- Created_At

> Business
- Id
- User_Id
- Business_Name
- Created_At

> Sales
- Id
- Business_Id
- Sale_Date
- Order_Number
- Customer_Name
- Product_Name
- Sale_Price
- Created_At

## 2NF

> Users
- Id (PK)
- Username
- Password
- Created_At

> Business
- Id (PK)
- User_Id (FK → Users.Id)
- Business_Name
- Created_At

> Sales
- Id (PK)
- Business_Id (FK → Business.Id)
- Sale_Date
- Order_Number
- Customer_Name
- Product_Name
- Sale_Price
- Created_At

## 3NF

> Users
- Id (PK)
- Username
- Password
- Created_At

> Business
- Id (PK)
- User_Id (FK → Users.Id)
- Business_Name
- Created_At

> Sales
- Id (PK)
- Business_Id (FK → Business.Id)
- Sale_Date
- Order_Number
- Customer_Name
- Product_Name
- Sale_Price
- Created_At



