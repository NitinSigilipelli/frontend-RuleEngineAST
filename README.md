# Rule Engine Application

This is a React-based Rule Engine application that allows users to create, combine, and evaluate rules based on user data. The application interacts with a backend API for rule management.

## Features

- **Create Rule**: Users can input a rule and submit it to be created.
- **Combine Rules**: Users can combine multiple rules with logical operators (AND/OR).
- **Evaluate Rule**: Users can evaluate a rule against provided user data (age, department, salary, experience).
- **Error Handling**: The application provides feedback in case of errors during API calls.
- **Display Results**: Results of rule evaluations, created rules, and combined rules are displayed to users.

## Technologies Used

- **Frontend**: React
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NitinSigilipelli/frontend-RuleEngineAST.git
   ```
2. Move to frontend Directory
   ```bash
   cd frontend
   ```
3.Install node modules
   ```bash
   npm i
   ```
4.Install axios package
   ```bash
   npm i axios
   ```
5.Start the application
   ```bash
   npm run start
   ```
## API Endpoints

The application interacts with the following API endpoints:

- **Create Rule**: 
  - `POST http://localhost:8081/api/rules/create`
  - **Body**: 
    ```json
    {
      "ruleString": "your_rule_here"
    }
    ```

- **Combine Rules**: 
  - `POST http://localhost:8081/api/rules/combine`
  - **Body**: 
    ```json
    {
      "ruleStrings": ["rule1", "rule2"],
      "operator": "AND"
    }
    ```

- **Evaluate Rule**: 
  - `POST http://localhost:8081/api/rules/evaluate`
  - **Body**: 
    ```json
    {
      "ruleString": "your_rule_here",
      "userData": ["age", "department", "salary", "experience"]
    }
    ```

## Usage

1. Select the desired action from the dropdown: **Create Rule**, **Combine Rules**, or **Evaluate Rule**.
2. Fill in the required inputs based on the selected action.
3. Click on the corresponding button to submit your action.


