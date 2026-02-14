# Demo Authentication System - Migration Guide

## Running the Migrations

To set up the demo authentication system, you need to run the SQL migrations in your Supabase database.

### Option 1: Using Supabase Dashboard (Recommended for Demo)

1. Go to your Supabase project dashboard: https://ekgcpuqmnkvuemcbmwgl.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Run the migrations in this order:

   **Step 1: Create Tables** (if not already done)
   - Run `users.sql`
   - Run `sitter_profiles.sql` (note: filename is `sitterprofile.sql`)
   - Run `children.sql`
   - Run `sessions.sql`
   - Run `reviews.sql`

   **Step 2: Seed Dummy Data**
   - Run `seed_dummy_users.sql`

4. Verify the data was inserted by running:
   ```sql
   SELECT * FROM users;
   SELECT * FROM sitter_profiles;
   ```

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref ekgcpuqmnkvuemcbmwgl

# Run migrations
supabase db push
```

## Testing the API Endpoints

Once the migrations are complete, you can test the API endpoints:

### Test 1: Get user by email
```bash
curl http://localhost:3000/api/users?email=sarah.johnson@example.com
```

### Test 2: Get all users
```bash
curl http://localhost:3000/api/users
```

### Test 3: Get user by ID
```bash
curl http://localhost:3000/api/users/a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d
```

## Dummy User Accounts

Here are the dummy users you can use for testing:

### Parents
- **Sarah Johnson**: sarah.johnson@example.com (ID: a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d)
- **Michael Chen**: michael.chen@example.com (ID: b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e)
- **Emily Rodriguez**: emily.rodriguez@example.com (ID: c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f)

### Sitters
- **Alex Thompson**: alex.thompson@example.com (ID: d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a)
- **Jessica Martinez**: jessica.martinez@example.com (ID: e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b)
- **David Kim**: david.kim@example.com (ID: f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c)

## Using in Your Frontend

To use this demo authentication in your frontend:

1. **Store current user ID** in React state or localStorage:
   ```javascript
   // Example: Set current user
   localStorage.setItem('currentUserId', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d');
   ```

2. **Fetch user profile** when needed:
   ```javascript
   const userId = localStorage.getItem('currentUserId');
   const response = await fetch(`/api/users/${userId}`);
   const { data: user } = await response.json();
   ```

3. **Create a user switcher** for demo purposes:
   ```javascript
   // Simple dropdown to switch between users
   function UserSwitcher() {
     const [users, setUsers] = useState([]);
     
     useEffect(() => {
       fetch('/api/users')
         .then(res => res.json())
         .then(data => setUsers(data.data));
     }, []);
     
     const switchUser = (userId) => {
       localStorage.setItem('currentUserId', userId);
       window.location.reload();
     };
     
     return (
       <select onChange={(e) => switchUser(e.target.value)}>
         {users.map(user => (
           <option key={user.id} value={user.id}>
             {user.name} ({user.user_type})
           </option>
         ))}
       </select>
     );
   }
   ```

## Replacing with Real Authentication

When you're ready to implement real authentication with Supabase Auth:

1. **Replace the API calls** in your frontend:
   ```javascript
   // OLD (demo):
   const response = await fetch(`/api/users/${userId}`);
   
   // NEW (real auth):
   const { data: { user } } = await supabase.auth.getUser();
   ```

2. **Update the helper functions** in `/lib/auth/demo.js`:
   - Replace with Supabase Auth methods
   - Use `supabase.auth.signUp()`, `supabase.auth.signIn()`, etc.

3. **Add authentication middleware** to protect routes

4. **Remove the demo endpoints** (`/api/users` and `/api/users/[id]`) or restrict them to authenticated users only
