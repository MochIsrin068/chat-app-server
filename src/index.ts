import dotenv from "dotenv";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import morgan from "morgan";
import { decodeBase64ToObject } from "./helper";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 4000;
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || "",
  process.env.SUPABASE_API_KEY || ""
);

app.get("/contacts", async (req, res) => {
  const { data, error } = await supabase
    .from("contacts")
    .select(`*, messages(*)`);
  const dataHasMessages = data?.filter((item) => item?.messages?.length === 0);
  res.send(dataHasMessages);
});

app.get("/contact-chat", async (req, res) => {
  const { data, error } = await supabase
    .from("contacts")
    .select(`*, messages(*)`);
  const dataHasMessages = data?.filter((item) => item?.messages?.length > 0);
  res.send(dataHasMessages);
});

app.get("/messages", async (req, res) => {
  const params = req.query as { cursor: string };
  const cursor = params.cursor;

  const queryParams: any = decodeBase64ToObject(cursor);
  const { data, error } = await supabase
    .from("messages")
    .select("*, contacts(*)")
    .eq("contact_id", queryParams?.userId)
    .range(queryParams?.offset - 1 || 0, queryParams?.limit - 1 || 0)
    .order('id', { ascending: false })

  res.send(data);
});

app.post("/messages", async (req, res) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      contact_id: req?.body?.contact_id,
      message: req?.body?.message,
      created_at: req?.body?.created_at,
      is_owner: req?.body?.is_owner,
    })
    .select();

  if (error) {
    res.send(error);
  }
  res.send({
    isSuccess: true,
    data,
  });
});

app.get("/", (req, res) => {
  res.send("API Chat!");
});

app.get("*", (req, res) => {
  res.send("API Not Found");
});

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});