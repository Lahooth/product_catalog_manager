const API = window.location.origin.replace(/\/$/, "") + "/products/";

const tbody = document.getElementById("productsBody");
const drawer = document.getElementById("drawer");
const formTitle = document.getElementById("formTitle");
const productForm = document.getElementById("productForm");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const cancelBtn = document.getElementById("cancelBtn");
const toast = document.getElementById("toast");

const idEl = document.getElementById("productId");
const skuEl = document.getElementById("sku");
const nameEl = document.getElementById("name");
const priceEl = document.getElementById("price");
const activeEl = document.getElementById("active");

function showDrawer(editing = false) {
  drawer.classList.remove("hidden");
  formTitle.textContent = editing ? "Edit Product" : "Add Product";
}
function hideDrawer() {
  drawer.classList.add("hidden");
  productForm.reset();
  idEl.value = "";
  activeEl.checked = true;
}

function money(n) { return Number(n).toFixed(2); }
function badge(on) { return `<span class="badge ${on ? "" : "off"}">${on ? "Active" : "Inactive"}</span>`; }
function notify(msg, ok = true) {
  toast.textContent = msg;
  toast.className = "toast " + (ok ? "ok" : "err");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1500);
}

async function loadProducts() {
  const res = await fetch(API);
  const data = await res.json();
  renderRows(data);
}

async function createProduct(payload) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Create failed");
  return res.json();
}

async function updateProduct(id, payload) {
  const res = await fetch(API + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Update failed");
  return res.json();
}

async function deleteProduct(id) {
  const res = await fetch(API + id, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).detail || "Delete failed");
}

function renderRows(items) {
  tbody.innerHTML = "";
  items.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${escapeHtml(p.sku)}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>₹ ${money(p.price)}</td>
      <td>${badge(p.active)}</td>
      <td>
        <button class="btn small" data-edit='${JSON.stringify(p)}'>Edit</button>
        <button class="btn small danger" data-del="${p.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[m]));
}

tbody.addEventListener("click", async (e) => {
  const delId = e.target.getAttribute("data-del");
  const editJson = e.target.getAttribute("data-edit");

  if (editJson) {
    const p = JSON.parse(editJson);
    idEl.value = p.id;
    skuEl.value = p.sku;
    nameEl.value = p.name;
    priceEl.value = p.price;
    activeEl.checked = !!p.active;
    showDrawer(true);
  }

  if (delId) {
    if (confirm("Delete this product?")) {
      try {
        await deleteProduct(delId);
        notify("Deleted");
        loadProducts();
      } catch (err) { notify(err.message, false); }
    }
  }
});

openFormBtn.addEventListener("click", () => showDrawer(false));
closeFormBtn.addEventListener("click", hideDrawer);
cancelBtn.addEventListener("click", hideDrawer);

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = idEl.value.trim();
  const payload = {
    sku: skuEl.value.trim(),
    name: nameEl.value.trim(),
    price: Number(priceEl.value || 0),
    active: !!activeEl.checked
  };
  try {
    if (id) { await updateProduct(id, payload); notify("Updated"); }
    else    { await createProduct(payload);     notify("Created"); }
    hideDrawer(); loadProducts();
  } catch (err) { notify(err.message, false); }
});

loadProducts();
