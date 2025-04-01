import mongoose from 'mongoose';

// TODO: custom schema for inserting skills form admin delete this after consulting with aditya
const skillsSchema = new mongoose.Schema({
  industry: { type: String, required: true },
  skills: { type: [String], required: true },
},
{
  timestamps: true,
}

);

const Skills = mongoose.models.Skills || mongoose.model('Skills', skillsSchema);

export default Skills;


