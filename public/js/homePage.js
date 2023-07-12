const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

async function addExpense() {
  try {
    const category = document.getElementById("categoryBtn");
    const description = document.getElementById("descriptionValue");
    const amount = document.getElementById("amountValue");
    const categoryValue = category.textContent.trim();
    const descriptionValue = description.value.trim();
    const amountValue = amount.value.trim();

    if (categoryValue === "Select Category") {
      alert("Select the Category!");
      return;
    }
    if (!descriptionValue) {
      alert("Add the Description!");
      return;
    }
    if (!parseInt(amountValue)) {
      alert("Please enter a valid amount!");
      return;
    }

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // add leading zeros to day and month if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // create the date string in date-month-year format
    const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://16.171.85.224:3000/expense/addExpense",
      {
        date: dateStr,
        category: categoryValue,
        description: descriptionValue,
        amount: parseInt(amountValue),
      },
      { headers: { Authorization: token } }
    );

    if (res.status === 200) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllExpenses() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://16.171.85.224:3000/expense/getAllExpenses/1",
      { headers: { Authorization: token } }
    );

    table.innerHTML = "";

    res.data.expenses.forEach((expense) => {
      const id = expense.id;
      const date = expense.date;
      const categoryValue = expense.category;
      const descriptionValue = expense.description;
      const amountValue = expense.amount;

      const tr = document.createElement("tr");
      tr.className = "trStyle";
      table.appendChild(tr);

      const idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.style.display = "none";
      idValue.appendChild(document.createTextNode(id));

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      const td4 = document.createElement("td");

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      const editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(idValue);
      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });

    const ul = document.getElementById("paginationUL");
    ul.innerHTML = "";

    for (let i = 1; i <= res.data.totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      li.className = "page-item";
      a.className = "page-link";
      a.href = "#";
      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
      a.addEventListener("click", paginationBtn);
    }
  } catch (error) {
    console.log(error);
  }
}

async function paginationBtn(e) {
  try {
    const pageNo = e.target.textContent;
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://16.171.85.224:3000/expense/getAllExpenses/${pageNo}`,
      { headers: { Authorization: token } }
    );

    table.innerHTML = "";

    res.data.expenses.forEach((expense) => {
      const id = expense.id;
      const date = expense.date;
      const categoryValue = expense.category;
      const descriptionValue = expense.description;
      const amountValue = expense.amount;

      const tr = document.createElement("tr");
      tr.className = "trStyle";
      table.appendChild(tr);

      const idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.style.display = "none";
      idValue.appendChild(document.createTextNode(id));

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      const td4 = document.createElement("td");

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      const editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(idValue);
      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteExpense(e) {
  try {
    const token = localStorage.getItem("token");
    if (e.target.classList.contains("delete")) {
      const tr = e.target.parentElement.parentElement;
      const id = tr.children[0].textContent;
      const res = await axios.get(
        `http://16.171.85.224:3000/expense/deleteExpense/${id}`,
        { headers: { Authorization: token } }
      );
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

async function editExpense(e) {
  try {
    const token = localStorage.getItem("token");
    const categoryValue = document.getElementById("categoryBtn");
    const descriptionValue = document.getElementById("descriptionValue");
    const amountValue = document.getElementById("amountValue");
    const addExpenseBtn = document.getElementById("submitBtn");

    if (e.target.classList.contains("edit")) {
      const tr = e.target.parentElement.parentElement;
      const id = tr.children[0].textContent;

      const res = await axios.get(
        "http://16.171.85.224:3000/expense/getAllExpenses",
        { headers: { Authorization: token } }
      );

      res.data.forEach((expense) => {
        if (expense.id == id) {
          categoryValue.textContent = expense.category;
          descriptionValue.value = expense.description;
          amountValue.value = expense.amount;
          addExpenseBtn.textContent = "Update";

          addExpenseBtn.removeEventListener("click", addExpense);

          addExpenseBtn.addEventListener("click", async function update(e) {
            e.preventDefault();
            const res = await axios.post(
              `http://16.171.85.224:3000/expense/editExpense/${id}`,
              {
                category: categoryValue.textContent.trim(),
                description: descriptionValue.value,
                amount: amountValue.value,
              },
              { headers: { Authorization: token } }
            );
            window.location.reload();
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function buyPremium(e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://16.171.85.224:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );

  var options = {
    key: res.data.key_id,
    order_id: res.data.order.id,
    handler: async function (response) {
      const res = await axios.post(
        "http://16.171.85.224:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert("Welcome to our Premium Membership! You now have access to Reports and Leaderboard");
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
}

async function isPremiumUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://16.171.85.224:3000/user/isPremiumUser", {
    headers: { Authorization: token },
  });

  if (res.data.isPremiumUser) {
    buyPremiumBtn.innerHTML = "Premium Member &#128081";
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
    leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");
    reportsLink.setAttribute("href", "/reports/getReportsPage");
    buyPremiumBtn.removeEventListener("click", buyPremium);
  }
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

buyPremiumBtn.addEventListener("click", buyPremium);
addExpenseBtn.addEventListener("click", addExpense);
document.addEventListener("DOMContentLoaded", isPremiumUser);
document.addEventListener("DOMContentLoaded", getAllExpenses);
table.addEventListener("click", (e) => {
  deleteExpense(e);
});
table.addEventListener("click", (e) => {
  editExpense(e);
});
logoutBtn.addEventListener("click", logout);
