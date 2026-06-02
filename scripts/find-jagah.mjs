import { connectToDatabase } from '../src/lib/mongodb.ts';
import ProjectModel from '../src/lib/models/Project.ts';

(async () => {
  await connectToDatabase();
  const projects = await ProjectModel.find({ title: { $regex: 'jagah', $options: 'i' } });
  console.log(JSON.stringify(projects, null, 2));
  process.exit();
})();
