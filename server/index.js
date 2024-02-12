/**
 * Express server which defines REST api to interact with simple list.
 * @author Christopher Curtis
 */
import express from'express';
import cors from "cors";
import { sleep } from 'openai/core';

const app = express();  // Server is instantiated

// These options enable us to dump json payloads and define the return signal
const corsOptions = {
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(express.json());
app.use(cors(corsOptions));

// Substitute for a database
let items = [ {id: 0, name: "Moby Dick"}, {id: 1, name: "Catcher in the Rye"}, {id: 2, name: "Huckleberry Finn"}, {id: 3, name: "Jujutsu Kaisen"}, {id: 4, name: "Stranger no. 44"}];
let string = ["HelloWorld"];


// Defines default route to demonstate server status
app.get('/', (req,res) => {
    res.send("The server is up!");
});

// Retrieves list content
app.get('/list', async (req,res) => {
  console.log("List Requested");
  await sleep(2000);  // Simulates awating for operations
  res.send(items);
});

// Retrieves string content
app.get('/string', async (req, res) => {
  console.log("String Requested")
  await sleep(2000) // Simulates awaiting for operations
  res.send(string)
})

// Adds to list content
app.post('/list', async (req,res) => {
  console.log("REQUST:", req.body);
  const { id } = req.body;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      res.status(400).send("Attempting to add a duplicate item!");
      return;
    }
  }
  items = [...items, req.body];
  await sleep(2000);
  res.status(200).send("Added item");
});

// Adds to string content
app.post('/string', async(req,res) => {
  console.log("REQUEST:", req.body);
  string = [string[0] + "__" + req.body.str];
  await sleep(2000);
  res.status(200).send("Added to string");
})

// Deletes from the list given an id
app.delete('/list/:id', async (req,res) => {
  console.log("Deleting item with id:", req.params);
  const { id } = req.params;
  await sleep(2000);

  const length = items.length;
  items = items.filter(item => id != item.id);
  console.log(items);

  if (length === items.length) {
    res.status(400).send("ID not found");
    return;
  }

  res.status(200).send("Deleted item");
});

// Updates from the list
app.patch('/list/:id', async (req,res) => {
  console.log("Updating item with id:", req.params, req.body);
  const { id } = req.params;
  await sleep(2000);
  let hasUpdated = false;
  for(let i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      items[i] = req.body;
      hasUpdated = true;
    }
  }
  if (hasUpdated) res.status(200).send("Updated item");
  else res.status(400).send("Failed to find item")
})

// Handles "like" interaction for user feedback
app.post('/like', async (req,res) => {
  console.log("This interaction was liked:", req.body.params.data);
  await sleep(2000);
  res.send("This interaction was liked!");
});

// We define the port to listen on, and do so
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
