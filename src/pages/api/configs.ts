import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs, { WriteStream } from "fs";
import { array, number, object, string } from "yup";

const WidgetSchema = object({
  id: number().required(),
  name: string().required(),
  state: object().required(),
});

const ConfigSchema = array(WidgetSchema);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const dbDir = path.join(__dirname, "../../db");

  switch(method?.toUpperCase()) {
    case 'GET': {

      if (!fs.existsSync(dbDir)) {
        res.status(200).json([]);
      }

      try {
        const config = fs.readFileSync(path.join(dbDir, "db.json"), "utf-8");
        const json = JSON.parse(config.toString());
        res.status(200).json(json);
      } catch (error) {
        res.status(200).json([])
      }

      break;
    }
    case 'POST': {
      const config = req.body?.config;
      if (!config) {
        res.status(400).send("Bad request");
        return;
      }

      const valid = ConfigSchema.validate(config)
      if (!valid) {
        res.status(400).send("Bad request");
        return;
      }

      if (!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir);
      }

      fs.writeFileSync(path.join(dbDir, "db.json"), JSON.stringify(config, null, 2), 'utf-8');
      res.status(200).send('ok');
    }
  }

  return res.status(404).send('Not found')
}
