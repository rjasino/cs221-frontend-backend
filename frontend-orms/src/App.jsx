import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get("http://localhost:3000/customers");
      console.log(response);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div>
        <h1>Welcome to React</h1>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div>
          <button onClick={fetchCustomer}>Fetch Customers</button>
          {data &&
            data.map((customer) => (
              <div key={customer.id}>
                <h1>
                  Customer Name:{" "}
                  {customer.last_name + " " + customer.first_name}
                </h1>
                <p>Customer Username: {customer.username}</p>
                <p>Customer Email: {customer.email}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
