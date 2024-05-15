const http = require('http');
const url = require('url');

const items = [
  { id: 1, name: "item 1", description: "description 1" },
  { id: 2, name: "item 2", description: "description 2" },
  { id: 3, name: "item 3", description: "description 3" },
  { id: 4, name: "item 4", description: "description 4" },
  { id: 5, name: "item 5", description: "description 5" },
  { id: 6, name: "item 6", description: "description 6" }, 
  { id: 7, name: "item 7", description: "description 7" },
  { id: 8, name: "item 8", description: "description 8" },
  { id: 9, name: "item 9", description: "description 9" },
  { id: 10, name: "item 10", description: "description 10" }, 
  { id: 11, name: "item 11", description: "description 11" }, 
  { id: 12, name: "item 12", description: "description 12" }, 
  { id: 13, name: "item 13", description: "description 13" },
];

// Handle request to get list of items
const handleApiGetListItem = (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: "Get items successfully",
    data: items
  }));
};

// Handle request to get item detail by ID
const handleApiGetItemDetailById = (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const pathSegments = parseUrl.pathname.split("/");
  const itemId = parseInt(pathSegments[pathSegments.length - 1]);
  const item = items.find(item => item.id === itemId);

  if (item) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Get item detail successfully",
      data: item
    }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Item Id Not found");
  }
};

// Handle request to get items with pagination
const handleApiGetItemPagination = (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const pageIndex = parseInt(parseUrl.query.pageIndex) || 1;
  const limit = parseInt(parseUrl.query.limit) || 10;

  const startIndex = (pageIndex - 1) * limit;
  const endIndex = startIndex + limit;

  const result = {
    data: items.slice(startIndex, endIndex),
    pageIndex,
    limit,
    totalPages: Math.ceil(items.length / limit)
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    message: "Get item pagination successfully",
    data: result
  }));
};

// Handle request to create a new item
const handleApiCreateNewItem = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const newItem = JSON.parse(body);
    newItem.id = items.length + 1;
    items.push(newItem);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      message: "Create new item successfully",
      data: newItem
    }));
  });
};

const server = http.createServer((req, res) => {
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const pathSegments = path.split("/");
  const itemId = parseInt(pathSegments[pathSegments.length - 1]);

  if (req.method === "GET" && path === "/api/items") {
    handleApiGetListItem(req, res);
  } else if (req.method === "GET" && path.startsWith("/api/items/") && !isNaN(itemId)) {
    handleApiGetItemDetailById(req, res);
  } else if (req.method === "GET" && path === "/api/items/pagination") {
    handleApiGetItemPagination(req, res);
  } else if (req.method === "POST" && path === "/api/items") {
    handleApiCreateNewItem(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
