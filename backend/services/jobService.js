const Job = require('../models/Job');

// Create Job
const createJob = async (title, description, difficulty, category, locationData, deadline, createdBy) => {
  try {
    // Check for duplicate jobs
    const existingJob = await Job.findOne({ title, description, createdBy });
    if (existingJob) {
      throw new Error('A job with the same title and description already exists.');
    }

    let location = null;
    if (locationData && locationData.type) {
      location = {
        type: locationData.type,
        address: locationData.address,
        coordinates: locationData.coordinates,
      };
    }

    // Create a new job
    const job = new Job({
      title,
      description,
      difficulty,
      category,
      location,
      deadline,
      createdBy,
    });
    await job.save();
    return job;
  } catch (err) {
    throw new Error(err.message || 'Error creating job');
  }
};

// Accept Job
const acceptJob = async (jobId, assignedTo) => {  
  try {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.createdBy.toString() === assignedTo.toString()) throw new Error('Cannot Accept Own Job');  
    if (job.status !== 'open') throw new Error('Job is no longer available');
    job.status = 'in-progress';
    job.assignedTo = assignedTo; 
    await job.save();
    return job;
  } catch (err) {
    throw new Error('Error accepting job');
  }
};

// Get All Jobs
const getAllJobs = async (difficulty) => {
  try {
    const filter = difficulty ? { difficulty } : {};
    const jobs = await Job.find(filter).populate('createdBy', 'name');
    return jobs;
  } catch (err) {
    throw new Error('Error fetching jobs');
  }
};

// Get Jobs Posted by Current User
const getMyPostedJobs = async (userId) => {
  try {
    return await Job.find({ createdBy: userId }); // Ensure `createdBy` is the correct field in your Job model
  } catch (err) {
    throw new Error('Error fetching posted jobs');
  }
};

// Get Jobs Accepted by Current User
const getMyAcceptedJobs = async (userId) => {
  try {
    return await Job.find({ assignedTo: userId, status: 'in-progress' });
  } catch (err) {
    throw new Error('Error fetching accepted jobs');
  }
};

// Get Jobs Completed by Current User
const getMyCompletedJobs = async (userId) => {
  try {
    return await Job.find({ assignedTo: userId, status: 'completed' });
  } catch (err) {
    throw new Error('Error fetching completed jobs');
  }
};

// Complete Job
const completeJob = async (jobId, assignedTo) => {  
  try {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (String(job.assignedTo) !== assignedTo) throw new Error('Not authorized to complete this job'); 
    job.status = 'completed';
    await job.save();
    return job;
  } catch (err) {
    throw new Error('Error completing job');
  }
};

// Edit Job
const editJob = async (jobId, title, description, difficulty, category, locationData, deadline, userId) => {
  try {
    console.log('Edit Job Service Input:', { jobId, userId }); // Debugging log
    const job = await Job.findById(jobId);
    console.log('Job Found:', job); // Debugging log
    if (!job) throw new Error('Job not found');
    if (String(job.createdBy) !== String(userId)) throw new Error('Not authorized to edit this job'); // Fix comparison

    let location = job.location; // keep existing if not provided
    if (locationData && locationData.type) {
      location = {
        type: locationData.type,
        address: locationData.address,
        coordinates: locationData.coordinates,
      };
    }

    job.title = title || job.title;
    job.description = description || job.description;
    job.difficulty = difficulty || job.difficulty;
    job.category = category || job.category;
    job.location = location;
    job.deadline = deadline || job.deadline;
    await job.save();
    return job;
  } catch (err) {
    console.error('Error in editJob Service:', err.message); // Debugging log
    throw new Error(err.message || 'Error editing job');
  }
};

// Cancel Job
const cancelJob = async (jobId, createdBy) => {  
  try {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (String(job.createdBy) !== createdBy) throw new Error('Not authorized to cancel this job');  
    if (job.status !== 'open') throw new Error('Job is already in progress or completed');
    job.status = 'canceled';
    await job.save();
    return job;
  } catch (err) {
    throw new Error('Error Canceling Job');
  }
};

// Delete Job
const deleteJob = async (jobId) => {
  try {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) throw new Error('Job not found');
    return job;
  } catch (err) {
    throw new Error('Error Deleting Job');
  }
};

// Add Candidate
const addCandidate = async (jobId, candidateId, currentUserId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');
    // Allow if current user is the creator or the candidate is applying themselves
    if (String(job.createdBy) !== String(currentUserId) && String(candidateId) !== String(currentUserId)) {
      throw new Error('Not authorized to add candidates');
    }
    if (job.candidates.includes(candidateId)) throw new Error('User is already a candidate');
    job.candidates.push(candidateId);
    await job.save();
    return job;
  } catch (err) {
    throw new Error(err.message || 'Error adding candidate');
  }
};

// Remove Candidate
const removeCandidate = async (jobId, candidateId, currentUserId) => {
  try {
    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (String(job.createdBy) !== String(currentUserId)) throw new Error('Not authorized to remove candidates');
    job.candidates = job.candidates.filter(id => String(id) !== String(candidateId));
    await job.save();
    return job;
  } catch (err) {
    throw new Error(err.message || 'Error removing candidate');
  }
};

module.exports = {
  createJob,
  acceptJob,
  getAllJobs,
  getMyPostedJobs,
  getMyAcceptedJobs,
  getMyCompletedJobs,
  completeJob,
  editJob,
  cancelJob,
  deleteJob,
  addCandidate,
  removeCandidate
};
