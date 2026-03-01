# 🐶 Woof: Stray Dog Reporting & Adoption System

## 🏗️ Technical Architecture
Woof is built using a modern **Microservices Architecture** with Spring Boot, ensuring scalability and separation of concerns.

- **`woof-gateway`**: API Gateway built with Spring Cloud Gateway routing frontend requests (`http://localhost:8000`) to the respective backend microservices.
- **`service-reg`**: Netflix Eureka Server (`http://localhost:8761`) for central service discovery.
- **`woof-analysis-service`**: Handles image AI condition analysis (via Groq API), serves the frontend UI (`http://localhost:8080`), and calculates DBSCAN hotspot clusters.
- **`woof-adoption-service`**: Manages the end-to-end lifecycle of reported dogs (State machine: `REPORTED` -> `NEEDS_TREATMENT` -> `IN_SHELTER` -> `AVAILABLE_FOR_ADOPTION` -> `ADOPTED`). Exposes the Shelter Manager Dashboard and Adoption Gallery APIs.
- **`woof-payment-service`**: Handles user donations and blockchain simulation.
- **`woof-user-service`**: Handles user accounts and authentication profiles.

### 🚀 How to Run Locally

Ensure **Docker Desktop** is running on your machine.

1. Clone the repository and navigate to the project root.
2. Build and start all microservices:
   ```bash
   docker-compose up -d --build
   ```
3. Open your browser and navigate to:
   - **Main Portal**: `http://localhost:8080`
   - **Shelter Dashboard**: `http://localhost:8080/static/shelter_dashboard.html`
   - **Adoption Gallery**: `http://localhost:8080/static/adoption_gallery.html`

4. To stop the application:
   ```bash
   docker-compose down
   ```

---

## 📝 1. User Reporting System

### 📌 Report Stray Dogs with Ease
Users can report stray dogs by providing the following details:
- **Location:** Auto-detect via GPS or manual pin selection.
- **Photo Upload:** Verify the dog's condition with an image.
- **Vision AI Model for Condition Analysis:** AI-based analysis of the dog's health, classifying the condition into:
  - 🟢 **Healthy**
  - 🟡 **Mildly Injured/Sick**
  - 🟠 **Moderately Injured/Sick**
  - 🔴 **Critical Condition**

---

## 🌍 2. AI-Based Hotspot Detection

### 🔍 AI-Based Hotspot Detection Using DBSCAN

#### 📌 Approach Overview
Our enhanced **DBSCAN (Density-Based Spatial Clustering of Applications with Noise)** algorithm prioritizes severity while also considering older reports. This ensures detected hotspots accurately reflect real-world conditions.

#### 🚀 Key Features
1. **Density-Based Clustering (DBSCAN)**
   Categorizes reports into Core Points, Border Points, and Noise Points based on radius `ε` and `MinPts`.
2. **Severity Weighting**
   Reports are weighted based on severity, giving higher priority to more critical cases.
3. **Time Decay Factor**
   Older reports gradually lose their influence using an exponential decay function.
4. **Custom Weighted Distance Function**
   A modified distance function incorporates severity-based weighting, ensuring high-severity points cluster closely.

### 📊 Visualization with Folium
Clusters are plotted on an interactive **Folium** map:
- **🔴 Red = Emergency** (High Priority)
- **🟠 Orange = Injured** (Medium Priority)
- **🟢 Green = Healthy** (Low Priority)

---

## 🏡 3. Shelter Management & Adoption System

### 🏥 Shelter Dashboard
- **Lifecycle Management**: Shelter workers track reported dogs from street to adoption via a managed state machine.
- **Medical Updates**: Transition statuses from `NEEDS_TREATMENT` (clinic) to `IN_SHELTER` (recovering) and finally to `AVAILABLE_FOR_ADOPTION`.

### 🌟 Adoption Gallery
- **Choose Your Perfect Companion**: Browse a dynamic gallery of rehabilitated dogs ready for a forever home.
- **Detailed Profiles**: View images, medical history, age, breed, and temperament.
- **Submit Adoption Requests**: Contact shelters directly regarding specific dogs seamlessly through the integrated platform UI.

---

🎉 **Start your journey to finding a loving furry friend and making a difference today!**
