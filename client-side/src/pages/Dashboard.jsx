import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import {
  FilePlus,
  CalendarClock,
  Send,
  Settings,
  X,
  Menu,
  Video,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
// import { CheckBox } from "@mui/icons-material";
// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from "react-datepicker";
const tabs = [
  { name: "New Post", value: "new", icon: <FilePlus size={18} /> },
  { name: "Scheduled", value: "scheduled", icon: <CalendarClock size={18} /> },
  { name: "Published", value: "published", icon: <Send size={18} /> },
  { name: "Settings", value: "settings", icon: <Settings size={18} /> },
];

const useQuery = () => new URLSearchParams(useLocation().search);

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentTab, setTab }) => (
  <aside
    className={`bg-black w-64 p-6 flex-col fixed sm:relative z-20 transform transition-transform duration-300 ease-in-out h-full
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
  >
    <div className="flex justify-center mb-6">
      <h1 className="text-white text-lg font-bold">
        E a s y P o s t l y{" "}
        <span className="text-primary font-black text-4xl">.</span>
      </h1>
    </div>
    <nav className="flex flex-col gap-4 pt-8">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => {
            setTab(tab.value);
            setSidebarOpen(false);
          }}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-left ${currentTab === tab.value
            ? "bg-primary text-white font-semibold"
            : "text-white hover:bg-primary"
            }`}
        >
          {tab.icon}
          {tab.name}
        </button>
      ))}
    </nav>
  </aside>
);

/* NEW POST TAB (Multi‑Channel Post) 
   Users can compose a post, select which platforms to post to, and schedule a post. */

const NewPostTab = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file)); // Create a URL for the video to preview it
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Post</h1>
      <p className="text-gray-500">Upload and schedule your videos  </p>
      <div className="flex items-center justify-start w-full">
        {videoUrl ? (
          <div className="p-3 w-[70%]">
            <div className="rounded-lg p-4 relative">

              <div className="flex p-2 space-x-4">
                <video width="200" controls>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="w-full space-y-3">
                  <div>
                    <label>Title</label>
                    <input
                      type="text"
                      className="text-[13px] w-full border border-gray-300 rounded-md p-2 outline-none focus:border-1 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label >Caption</label>
                    <textarea
                      rows={10}
                      className="text-[13px] h-40 resize-none w-full border border-gray-300 rounded-md p-2 outline-none focus:border-1 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label >Visibility</label>
                    <select className="text-[13px] w-full border border-gray-300 rounded-md p-2 outline-none focus:border-1 focus:border-primary" >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="unlisted">Unlisted</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="privacy" className="text-edit_color_2">
                      Allow users to
                    </label>

                    <div className="flex justify-start space-x-7 pt-2 pl-2">
                      <div className="space-x-3 justify-center flex">
                        <label htmlFor="stitch">Stitch</label>
                        <input type="checkbox" name="Stitch" id="stich"
                          className="h-5 w-5 rounded-lg border-edit_color_2/10 bg-edit_color_2/5 transition-all hover:scale-105 hover:before:opacity-0"
                        />
                      </div>
                      <div className="space-x-3 justify-center flex">
                        <label htmlFor="comment">Comment</label>
                        <input type="checkbox" name="comment" id="comment"
                          className="h-5 w-5 rounded-lg border-edit_color_2/10 bg-edit_color_2/5 transition-all hover:scale-105 hover:before:opacity-0"
                        />
                      </div>
                      <div className="space-x-3 justify-center flex">
                        <label htmlFor="duet">Duet</label>
                        <input type="checkbox" name="Duet" id="duet"
                          className="h-5 w-5 rounded-lg border-edit_color_2/10 bg-edit_color_2/5 transition-all hover:scale-105 hover:before:opacity-0"
                        />
                      </div>
                    </div>
                  </div>
                  <div >
                    <label htmlFor="date">Schedule Data</label>
                    <div>
                    <DatePicker
                      minDate={new Date()}
                      showTimeSelect
                      dateFormat="Pp"
                      className="py-1 w-full text-edit_color_2 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 
                       />
                    </div>
                    
                  </div>
                </div>
                
              </div>

            </div>
            <div className="flex justify-end space-x-2 ">
                  <button onClick={() => setVideoUrl(null)} className="text-red-600 px-3  rounded-full">
                  Remove
                  </button>
                  <button className="bg-primary text-white rounded-xl px-3 py-2">Schedule</button>

                </div>
            <div>

            </div>
          </div>

        ) : <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-fit border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" onChange={handleFileChange} type="file" accept="video/*" className="hidden" />
        </label>}

      </div>

    </div>
  );
};


/* Other tabs remain as examples. In a real app, 
   these would show aggregated scheduled posts, analytics, etc. */

const ScheduledTab = () => {
  const scheduledPosts = [
    { id: 1, title: "Multi-Channel Post 1", schedule: "2025-05-01 10:00 AM" },
    { id: 2, title: "Multi-Channel Post 2", schedule: "2025-05-02 02:30 PM" },
    { id: 3, title: "Multi-Channel Post 3", schedule: "2025-05-03 09:00 AM" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Scheduled Posts</h1>
      <ul className="space-y-4">
        {scheduledPosts.map((post) => (
          <li key={post.id} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">{post.title}</h3>
            <p className="text-gray-600 mt-2">Scheduled for: {post.schedule}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PublishedTab = () => {
  const publishedPosts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Published Post ${i + 1}`,
    excerpt: "This is a short excerpt from the published post.",
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Published Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {publishedPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-gray-700">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.excerpt}</p>
            <button className="mt-4 text-sm text-primary hover:underline">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
    <form className="space-y-6 max-w-md">
      <div>
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-gray-700">Theme</label>
        <select className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
      >
        Save Settings
      </button>
    </form>
  </div>
);

const PageContent = ({ currentTab }) => {
  switch (currentTab) {
    case "new":
      return <NewPostTab />;
    case "scheduled":
      return <ScheduledTab />;
    case "published":
      return <PublishedTab />;
    case "settings":
      return <SettingsTab />;
    default:
      return <NewPostTab />;
  }
};

const ContentWrapper = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState(query.get("tab") || "new");

  useEffect(() => {
    const current = query.get("tab");
    if (current !== tab) navigate(`?tab=${tab}`);
  }, [tab, navigate, query]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentTab={tab}
        setTab={setTab}
      />
      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <header className="sm:hidden flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="font-bold text-lg">Dashboard</h1>
          <div style={{ width: 24 }}></div>
        </header>
        <main className="flex-1 overflow-auto">
          <PageContent currentTab={tab} />
        </main>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <ContentWrapper />
  );
}
