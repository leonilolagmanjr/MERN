import React, { useState, useEffect } from "react";
import { fetchJobs } from "../services/api";
import { Link } from "react-router-dom";
import CollapsibleText from "../components/CollapsibleText";
import {
  Search,
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  MapPin,
  CheckCircle,
  Heart,
  Code2,
  Pencil,
  Megaphone,
  FileText,
  Smartphone,
  Camera,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

const CATEGORY_TAG_STYLE = {
  Development:
    "bg-[rgba(83,74,183,0.25)] text-[#a09be0] border border-[rgba(83,74,183,0.3)]",
  Design:
    "bg-[rgba(13,110,204,0.2)] text-[#6ba8e0] border border-[rgba(13,110,204,0.3)]",
  Marketing:
    "bg-[rgba(162,46,121,0.2)] text-[#d07bbf] border border-[rgba(162,46,121,0.3)]",
  Writing:
    "bg-[rgba(15,110,86,0.2)] text-[#5ec9a0] border border-[rgba(15,110,86,0.3)]",
  Other:
    "bg-[rgba(120,120,140,0.2)] text-[#a0a0b8] border border-[rgba(120,120,140,0.25)]",
};

const TYPE_TAG_STYLE = {
  "Full Time":
    "bg-[rgba(200,136,74,0.15)] text-[#c8884a] border border-[rgba(200,136,74,0.25)]",
  Contract:
    "bg-[rgba(120,120,140,0.2)] text-[#a0a0b8] border border-[rgba(120,120,140,0.25)]",
  "Part Time":
    "bg-[rgba(200,136,74,0.15)] text-[#c8884a] border border-[rgba(200,136,74,0.25)]",
};

const CATEGORY_ICON = {
  Development: <Code2 size={16} />,
  Design: <Pencil size={16} />,
  Marketing: <Megaphone size={16} />,
  Writing: <FileText size={16} />,
  Other: <Briefcase size={16} />,
};

const CATEGORY_LOGO_STYLE = {
  Development: { bg: "bg-[rgba(83,74,183,0.25)]", text: "text-[#a09be0]" },
  Design: { bg: "bg-[rgba(13,110,204,0.2)]", text: "text-[#6ba8e0]" },
  Marketing: { bg: "bg-[rgba(162,46,121,0.2)]", text: "text-[#d07bbf]" },
  Writing: { bg: "bg-[rgba(15,110,86,0.2)]", text: "text-[#5ec9a0]" },
  Other: { bg: "bg-[rgba(120,120,140,0.2)]", text: "text-[#a0a0b8]" },
};

const CATEGORIES = ["Development", "Design", "Marketing", "Writing", "Other"];
const JOB_TYPES = ["Remote", "On-site", "Hybrid"];

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-r  border-[rgba(200,136,74,0.2)] last:border-r-0">
      <div className="bg-[rgba(200,136,74,0.15)] rounded-lg p-2 flex items-center justify-center">
        <span className="text-[#c8884a]">{icon}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-[#c8884a] leading-none">{value}</p>
        <p className="text-[11px] text-[rgba(232,226,212,0.55)] mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const logo = CATEGORY_LOGO_STYLE[job.category] || CATEGORY_LOGO_STYLE.Other;
  const icon = CATEGORY_ICON[job.category] || <Briefcase size={16} />;
  const currencySymbol = (job.currency || "USD") === "USD" ? "$" : "₱";
  const price = `${currencySymbol}${(job.price || 0).toFixed(2)}`;

  return (
    <Link to={`/job/${job._id}`} className="no-underline block">
      <div
        className="
        bg-[#1e1e26]
        border border-[rgba(200,136,74,0.2)]
        rounded-xl
        p-4
        cursor-pointer
        transition-all
        duration-200
        aspect-square
        flex
        flex-col
      "
      >
        {/* Card top */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${logo.bg}`}
            >
              <span className={logo.text}>{icon}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#f0e8d8] leading-snug">
                {job.title}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-[rgba(232,226,212,0.55)] mt-0.5">
                {job.company || job.employer || "Unknown"}
                <CheckCircle size={10} className="text-[#c8884a]" />
              </div>
            </div>
          </div>
          <button
            className="text-[rgba(232,226,212,0.4)] hover:text-[#e05a7a] transition-colors"
            aria-label="Save job"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={15} />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-1.5 text-[11px] text-[rgba(232,226,212,0.55)] mb-3">
          <MapPin size={10} className="text-[#c8884a]" />
          <span>
            {job.location
              ? job.location.type === "physical"
                ? job.location.address
                : "Remote"
              : "Remote"}
          </span>
          <span className="text-[rgba(232,226,212,0.3)]">•</span>
          <span>Posted {new Date(job.dateListed).toLocaleDateString()}</span>
        </div>

        {/* Description */}
        <div className="text-[11px] text-[rgba(208,200,184,0.75)] leading-relaxed mb-3 grow">
          <CollapsibleText text={job.description} limit={100} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.category && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${CATEGORY_TAG_STYLE[job.category] || CATEGORY_TAG_STYLE.Other}`}
            >
              {job.category}
            </span>
          )}
          {job.jobType && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${TYPE_TAG_STYLE[job.jobType] || TYPE_TAG_STYLE.Contract}`}
            >
              {job.jobType}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-[#c8884a]">{price}</span>
          <button
            className="text-[11px] font-medium text-[#c8884a] border border-[#c8884a] rounded-md px-3 py-1 hover:bg-[#c8884a] hover:text-[#1a1008] transition-all duration-200"
            onClick={(e) => e.preventDefault()}
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}

function PaginationBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-md text-xs font-medium flex items-center justify-center transition-all
        ${
          active
            ? "bg-[#c8884a] border border-[#c8884a] text-[#1a1008] font-bold"
            : "border border-[rgba(200,136,74,0.2)] text-[#d0c8b8] hover:border-[#c8884a] hover:text-[#c8884a]"
        }`}
    >
      {children}
    </button>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  // ── fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchAllJobs();
  }, []);

  // ── search ───────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ── category filter ──────────────────────────────────────────────────────
  const toggleCategory = (cat) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    applyFilters(searchTerm, next, selectedTypes, sortOrder);
  };

  // ── type filter ──────────────────────────────────────────────────────────
  const toggleType = (type) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(next);
    applyFilters(searchTerm, selectedCategories, next, sortOrder);
  };

  // ── sort ─────────────────────────────────────────────────────────────────
  const handleSort = (val) => {
    setSortOrder(val);
    applyFilters(searchTerm, selectedCategories, selectedTypes, val);
  };

  // ── combined filter + sort ───────────────────────────────────────────────
  const applyFilters = (term, cats, types, sort) => {
    let result = [...jobs];

    if (term) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.description.toLowerCase().includes(term.toLowerCase()) ||
          job.category.toLowerCase().includes(term.toLowerCase()),
      );
    }

    if (cats.length > 0) {
      result = result.filter((job) => cats.includes(job.category));
    }

    if (types.length > 0) {
      result = result.filter((job) => {
        const loc = job.location?.type === "physical" ? "On-site" : "Remote";
        return types.includes(loc) || types.includes(job.locationType);
      });
    }

    if (sort === "Price: Low to High")
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "Price: High to Low")
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "Oldest")
      result.sort((a, b) => new Date(a.dateListed) - new Date(b.dateListed));
    if (sort === "Newest")
      result.sort((a, b) => new Date(b.dateListed) - new Date(a.dateListed));

    setFilteredJobs(result);
    setCurrentPage(1);
  };

  // ── reset ────────────────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSortOrder("Newest");
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // ── pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-8 bg-[#0d1117]">
      <div className="mx-auto max-w-6xl">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8  relative overflow-hidden border border-white/6"
          style={{
            background: "linear-gradient(145deg, #1a1f2e 0%, #151b27 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#c8884a]/20 bg-[#c8884a]/10">
              <Briefcase size={28} className="text-[#c8884a]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#f0e8d8]">
                Browse Available Jobs
              </h1>

              <p className="mt-1 text-sm text-[#c8884a]">
                Find your next opportunity from our curated list of jobs
              </p>
            </div>
          </div>
        </div>

        {/* ── Search Bar ───────────────────────────────────────────────────── */}
        <div className="flex gap-3 py-3 ">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8884a]"
            />
            <input
              type="text"
              placeholder="Search jobs by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-9 pr-4 py-3 bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-lg text-[#e8e2d4] text-sm placeholder-[rgba(232,226,212,0.35)] outline-none focus:border-[#c8884a] transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#c8884a] text-white rounded-lg font-semibold text-sm hover:bg-[#b07a40] transition-colors"
          >
            <Search size={15} />
            Search Jobs
          </button>
          <Link
            to="/jobmanager"
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#c8884a] text-white rounded-lg font-semibold text-sm hover:bg-[rgba(200,136,74,0.1)] transition-colors no-underline"
          >
            <Settings size={15} />
            Manage Your Jobs
          </Link>
        </div>

        {/* ── Stats Bar ────────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-4 border rounded-xl border-[rgba(200,136,74,0.2)] "
          style={{
            background: "linear-gradient(145deg, #1a1f2e 0%, #151b27 100%)",
          }}
        >
          <StatCard
            icon={<Briefcase size={18} />}
            value="124"
            label="Jobs Available"
          />
          <StatCard icon={<Users size={18} />} value="45" label="Employers" />
          <StatCard
            icon={<UserCheck size={18} />}
            value="32"
            label="Freelancers Hired"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            value="98%"
            label="Success Rate"
          />
        </div>

        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden mt-4">
          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside className="flex flex-col w-72 min-w-72 h-150 sticky bg-[#1e1e26] border-[rgba(200,136,74,0.2)] p-4 overflow-y-auto rounded-xl mr-4 justify-between">
            <div className="flex items-center gap-2 font-semibold text-[#e8e2d4] mb-2  ">
              <SlidersHorizontal size={15} className="text-[#c8884a] " />
              Filters
            </div>

            {/* Category */}
            <div className="mb-2 ">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-[rgba(232,226,212,0.55)] uppercase tracking-wider">
                  Category
                </span>
              </div>
              <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === 0}
                  onChange={() => {
                    setSelectedCategories([]);
                    applyFilters(searchTerm, [], selectedTypes, sortOrder);
                  }}
                  className="accent-[#c8884a] w-3.5 h-3.5"
                />
                <span className="text-xs text-[#d0c8b8]">All Categories</span>
              </label>
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 py-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-[#c8884a] w-3.5 h-3.5"
                  />
                  <span className="text-xs text-[#d0c8b8]">{cat}</span>
                </label>
              ))}
            </div>

            {/* Budget Range */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-[rgba(232,226,212,0.55)] uppercase tracking-wider">
                  Budget Range
                </span>
              </div>
              <div className="relative mb-2">
                <select className="w-full bg-[#141418] border border-[rgba(200,136,74,0.2)] rounded-md text-[#d0c8b8] text-xs py-1.5 px-2.5 outline-none appearance-none">
                  <option>Min. Budget</option>
                  <option>$100</option>
                  <option>$250</option>
                  <option>$500</option>
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(232,226,212,0.4)] pointer-events-none"
                />
              </div>
              <div className="relative">
                <select className="w-full bg-[#141418] border border-[rgba(200,136,74,0.2)] rounded-md text-[#d0c8b8] text-xs py-1.5 px-2.5 outline-none appearance-none">
                  <option>Max. Budget</option>
                  <option>$500</option>
                  <option>$1000</option>
                  <option>$2000</option>
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(232,226,212,0.4)] pointer-events-none"
                />
              </div>
            </div>

            {/* Job Type */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-semibold text-[rgba(232,226,212,0.55)] uppercase tracking-wider">
                  Job Type
                </span>
              </div>
              <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.length === 0}
                  onChange={() => {
                    setSelectedTypes([]);
                    applyFilters(searchTerm, selectedCategories, [], sortOrder);
                  }}
                  className="accent-[#c8884a] w-3.5 h-3.5"
                />
                <span className="text-xs text-[#d0c8b8]">All Types</span>
              </label>
              {JOB_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 py-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="accent-[#c8884a] w-3.5 h-3.5"
                  />
                  <span className="text-xs text-[#d0c8b8]">{type}</span>
                </label>
              ))}
            </div>

            <button
              onClick={resetFilters}
              className="w-full bg-transparent border border-[#c8884a] text-[#c8884a] rounded-md py-2 text-xs font-medium hover:bg-[rgba(200,136,74,0.1)] transition-colors"
            >
              Reset Filters
            </button>
          </aside>

          {/* ── Job Content ──────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-1 flex flex-col">
            {/* Content header */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#d0c8b8]">
                Found{" "}
                <strong className="text-[#c8884a]">
                  {filteredJobs.length}
                </strong>{" "}
                job{filteredJobs.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 text-xs text-[rgba(232,226,212,0.55)]">
                Sort by:
                <select
                  value={sortOrder}
                  onChange={(e) => handleSort(e.target.value)}
                  className="bg-[#1e1e26] border border-[rgba(200,136,74,0.2)] rounded-md text-[#d0c8b8] text-xs py-1 px-2 outline-none"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {paginatedJobs.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 flex-1">
                {paginatedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-[rgba(200,136,74,0.3)] rounded-xl bg-[rgba(30,30,38,0.4)]">
                <Briefcase
                  size={52}
                  className="text-[#c8884a] opacity-40 mb-4"
                />
                <p className="text-lg text-[#e8e2d4] mb-1">No jobs found</p>
                <p className="text-sm text-[rgba(232,226,212,0.5)] max-w-xs text-center">
                  {searchTerm
                    ? `No jobs matching "${searchTerm}"`
                    : "No jobs available at the moment"}
                </p>
                {(searchTerm || selectedCategories.length > 0) && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-sm text-[#c8884a] hover:text-[#e8e2d4] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Pagination ───────────────────────────────fi────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-4 border-[rgba(200,136,74,0.2)]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-md border border-[rgba(200,136,74,0.2)] flex items-center justify-center text-[#c8884a] hover:border-[#c8884a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from(
              { length: Math.min(totalPages, 4) },
              (_, i) => i + 1,
            ).map((page) => (
              <PaginationBtn
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationBtn>
            ))}

            {totalPages > 5 && (
              <span className="text-[rgba(232,226,212,0.4)] text-sm px-1">
                ...
              </span>
            )}

            {totalPages > 4 && (
              <PaginationBtn
                active={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </PaginationBtn>
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-md border border-[rgba(200,136,74,0.2)] flex items-center justify-center text-[#c8884a] hover:border-[#c8884a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
