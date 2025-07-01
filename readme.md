# ChatGPT Clone – Fullstack AI Chat Interface

### 🚀 Vercel Deployment Link  - [ChatGPT](https://chatgpt-ui-back.vercel.app/)


A robust, fullstack ChatGPT clone built with modern tools and best practices. The app replicates the original ChatGPT experience, including memory, file/image uploads, message editing, and seamless AI response handling through the Vercel AI SDK.


---

## 🧱 Tech Stack Used (Matches Original Requirements)

| Requirement                      | Implemented Technology                          |
|----------------------------------|--------------------------------------------------|
| **Frontend Framework**           | React + Next.js App Router                      |
| **Styling**                      | Tailwind CSS + ShadCN UI                        |
| **Chat Functionality**           | [Vercel AI SDK](https://sdk.vercel.ai)          |
| **Database**                     | MongoDB (via Mongoose)                         |
| **File/Image Upload**            | Cloudinary (Secure file hosting & previews)     |
| **Auth**                        | Clerk                     |
| **Message Streaming**            | Enabled via Vercel AI SDK                       |
| **Chat Memory**                  | `useMemo` for memory  |
| **Backend**                      | Next.js API Routes (App Router)                 |
| **Deployment**                   | Vercel                                          |
| **Accessibility**                | ARIA roles and responsive design                |
| **File Types Supported**         | PNG, JPG, PDF, DOCX, TXT                        |

---

## ✨ Features

### ✅ UI/UX
- ChatGPT-style responsive chat interface
- Clean layout with proper spacing, typography, and mobile behavior
- Animations, modals, scroll behavior, and ARIA support
- **Message editing** with automatic regeneration

### 🧠 AI Chat (Vercel AI SDK)
- Real-time message streaming
- Handles large context windows (trim/segment when needed)
- Custom token management logic
- Memory for multi-turn conversation context using **mem0**

### 📁 Upload Support
- Upload & preview:
  - 🖼️ Images: PNG, JPG
  - 📄 Docs: PDF, DOCX, TXT
- Cloudinary storage with previews and secure access

### ⚙️ Backend
- Built with **Next.js App Router**
- MongoDB for chat/message persistence
- Cloudinary integration for file uploads
- Modular code and scalable architecture

---

## 📦 Deliverables Checklist

- [x] Pixel-perfect (near) ChatGPT clone UI
- [x] Fully functional chat using Vercel AI SDK
- [x] Message editing, file/image upload, and memory context
- [x] MongoDB and Cloudinary backend integration
- [x] Deployed on Vercel
- [x] README with setup instructions
- [x] Clean and modular codebase with comments

---

> ⚠️ **Note**: The UI is not pixel-perfect but is very close to the original ChatGPT experience. All intended functionalities and workflows are implemented with full parity.
---


## 🚀 Getting Started

### 1. Clone the Repository

```bash
https://github.com/x15sr71/ChatGPT.git
cd ChatGPT
```


### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project with the following content:
```
# OpenAI & Memory API keys
OPENAI_API_KEY=your_openai_api_key
MEM0_API_KEY=your_mem0_api_key

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url

# Used by client-side widgets
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Clerk credentials
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# Debug mode (optional)
CLERK_DEBUG=true
```



