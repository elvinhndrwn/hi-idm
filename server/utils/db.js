import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "elvinhendrawan",
  host: "dpg-d4vt9e9r0fns739slli0-a.singapore-postgres.render.com",
  database: "playground_ed5d",
  password: "x0xx62EwTLHX3WQbOUgO84HKMJ2GbPB5",
  port: 5432,
});

export default pool;
