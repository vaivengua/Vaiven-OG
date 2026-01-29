# Supabase Project Restoration Guide

## Situation
Your Supabase project "CargoConnect" has been paused for over 90 days and cannot be restored through the dashboard. However, all your data is intact and can be restored to a new project.

## Quick Reference: Where to Find Connection String
- **Dashboard Path:** Settings (⚙️) → Database → Connection string section
- **Look for:** "Session pooler" or "URI" format
- **Format:** `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Solution: Create a New Project and Restore Backup

### Step 1: Download Your Backups
1. In your Supabase dashboard, go to the paused "CargoConnect" project
2. Click on **"Download backups"** button
3. Download both:
   - **Database backup (PG: 17.4.1.069)** - This contains all your database data
   - **Storage objects** - This contains all your file uploads (if any)

### Step 2: Create a New Supabase Project
1. **Stay in the same Supabase account** (no need for a new account)
2. Click on "New Project" in your Supabase dashboard
3. Name it (e.g., "CargoConnect" or "CargoConnect-Restored")
4. Choose your organization
5. Set a database password (save this securely!)
6. Choose a region (preferably the same as your original project)
7. Wait for the project to be created (takes a few minutes)

### Step 3: Restore the Database Backup

**Note:** Supabase doesn't currently offer a direct "restore from backup" button in the dashboard for new projects. You'll need to use the command-line method below.

#### Method: Restore via psql (Command Line) - RECOMMENDED

This is the most reliable way to restore your backup:

1. **Get your new project's connection details:**
   - Go to your new project's dashboard
   - Click on **"Settings"** (gear icon) in the left sidebar
   - Click on **"Database"**
   - Scroll to **"Connection string"** section
   - Copy the **"Session pooler"** connection string (it looks like: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`)
   - **OR** use the **"URI"** format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

2. **Prepare your backup file:**
   - The backup file you downloaded might be compressed (`.gz` extension)
   - If it's compressed, extract it first (you should end up with a `.backup` or `.sql` file)
   - Note the full path to your backup file

3. **Restore using psql:**
   
   **On Windows (PowerShell or Command Prompt):**
   ```powershell
   # If you have psql installed, use:
   psql "[CONNECTION_STRING]" -f "C:\path\to\your\backup.backup"
   
   # Example:
   psql "postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres" -f "C:\Users\Franz Hentze\Downloads\backup.backup"
   ```

   **If you don't have psql installed:**
   - Download PostgreSQL from: https://www.postgresql.org/download/windows/
   - Or use pgAdmin (includes psql)
   - Or use the Supabase CLI (see alternative method below)

4. **Alternative: Using Supabase CLI (Easier if you don't have psql):**
   
   Install Supabase CLI:
   ```powershell
   npm install -g supabase
   ```
   
   Then restore:
   ```powershell
   supabase db restore --db-url "[CONNECTION_STRING]" --file "path\to\backup.backup"
   ```

**Important Notes:**
- Replace `[CONNECTION_STRING]` with your actual connection string
- Replace the file path with your actual backup file path
- You may see some "object already exists" errors during restore - these are normal and can be ignored
- The restore process may take several minutes depending on your database size

### Step 3 Alternative: Easy Method Using pgAdmin (Windows-Friendly)

If you prefer a GUI tool instead of command line:

1. **Download and install pgAdmin 4:**
   - Go to: https://www.pgadmin.org/download/pgadmin-4-windows/
   - Install it (this includes psql and a graphical interface)

2. **Connect to your new Supabase project:**
   - Open pgAdmin
   - Right-click "Servers" → "Create" → "Server"
   - In the "General" tab, name it (e.g., "Supabase New Project")
   - In the "Connection" tab, enter:
     - **Host:** `db.[PROJECT-REF].supabase.co` (get this from Settings > Database)
     - **Port:** `5432`
     - **Database:** `postgres`
     - **Username:** `postgres`
     - **Password:** Your database password
   - Click "Save"

3. **Restore the backup:**
   - Right-click on your database → "Restore..."
   - In "Filename", browse to your `.backup` file
   - Click "Restore"
   - Wait for it to complete

### Step 4: Restore Storage Objects (if applicable)
If you downloaded storage objects:
1. Go to **Storage** in your new project
2. Create the same buckets that existed in your old project
3. Upload the storage files to their respective buckets

### Step 5: Update Your Application Configuration
1. In your new Supabase project, go to **Settings > API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

3. Create or update your `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-new-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-new-anon-key-here
   ```

4. **Important**: Make sure `.env` is in your `.gitignore` file to avoid committing secrets

### Step 6: Verify Everything Works
1. Restart your development server
2. Test authentication (login/signup)
3. Test database operations
4. Check that all your data is present

## Alternative: Contact Supabase Support
If you're on a paid plan, you can also contact Supabase support to see if they can restore the paused project directly. However, creating a new project and restoring the backup is usually faster and more reliable.

## Important Notes
- ⚠️ **Don't delete the old paused project** until you've verified everything works in the new one
- ⚠️ **Keep your backups safe** - download and store them locally
- ⚠️ **Update your environment variables** - the old project's URL and keys won't work
- ⚠️ **Check Row Level Security (RLS) policies** - you may need to recreate them in the new project
- ⚠️ **Check database functions/triggers** - these should be included in the backup, but verify

## Need Help?
If you encounter any issues during restoration, check:
- Supabase documentation: https://supabase.com/docs/guides/database/backups
- Supabase Discord community for support

