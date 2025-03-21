# 🐶 Woof: Stray Dog Reporting & Adoption System

## 📝 1. User Reporting System

### 📌 Report Stray Dogs with Ease
Users can report stray dogs by providing the following details:
- **Location:** Auto-detect via GPS or manual pin selection.
- **Photo Upload:** Verify the dog's condition with an image.
- **Additional Notes (Optional):** Specify the dog's condition if it isn't clear from the image.
- **Vision AI Model for Condition Analysis:** AI-based analysis of the dog's health, classifying the condition into:
  - 🟢 **Healthy**
  - 🟡 **Mildly Injured/Sick**
  - 🟠 **Moderately Injured/Sick**
  - 🔴 **Critical Condition**

---

## 🌍 2. AI-Based Hotspot Detection

### 🔍 AI-Based Hotspot Detection Using DBSCAN

### 📌 Approach Overview
Our enhanced **DBSCAN (Density-Based Spatial Clustering of Applications with Noise)** algorithm prioritizes severity while also considering older reports. This ensures detected hotspots accurately reflect real-world conditions.

### 🚀 Key Features

#### 1. **Density-Based Clustering (DBSCAN)**
DBSCAN operates with two core parameters:
- **Epsilon (ε):** Defines the neighborhood radius around a point.
- **MinPts:** The minimum number of points required within `ε` to form a dense region.

DBSCAN categorizes reports into:
- **Core Points:** Points with at least `MinPts` neighbors within `ε`.
- **Border Points:** Points within `ε` of a core point but lacking enough neighbors themselves.
- **Noise Points (Outliers):** Points that do not belong to any cluster.

#### 2. **Severity Weighting**
Reports are weighted based on severity, giving higher priority to more critical cases in clustering.

#### 3. **Time Decay Factor**
Older reports gradually lose their influence using an **exponential decay function**:


![DecayFactor](/formulas/decayfactor.png)

Where:
- `λ` (lambda) is the **decay constant**, controlling how quickly reports lose significance.
- `t` is the **time difference (in hours)** between the report and the latest report.

#### 4. **Custom Weighted Distance Function**
A **modified distance function** incorporates severity-based weighting, ensuring that high-severity points are more closely clustered:

![Weight](/formulas/weight.png)
![DistanceFunction](/formulas/distancefunction.png)

Where:
- `(lat_1, lon_1, w_1)` = Latitude, Longitude, and Weight of point A.
- `(lat_2, lon_2, w_2)` = Latitude, Longitude, and Weight of point B.
- `d_w(A, B)` = Weighted distance between two points.

### 📊 Visualization with Folium
Clusters are plotted on an interactive **Folium** map:
- **🔴 Red = Emergency** (High Priority)
- **🟠 Orange = Injured** (Medium Priority)
- **🟢 Green = Healthy** (Low Priority)

Each report displays **cluster ID** and **priority score**, helping users and authorities identify critical areas efficiently.

### 📌 Conclusion
By integrating **severity weighting, time decay, and a custom distance function**, our enhanced DBSCAN model ensures that clusters reflect real-time, high-priority cases while filtering out outdated or less critical data.

---

## 🏡 3. AI-Powered Adoption System

### 🌟 Key Features

#### 1. **Choose Your Perfect Companion**
- Browse a diverse range of dogs available for adoption.
- Filter by breed, age, size, temperament, and special needs.
- View detailed profiles including images, medical history, and personality traits.

#### 2. **Schedule a Meeting**
- Book an appointment to meet your chosen dog.
- Virtual or in-person meetings available based on preference.
- Interact with adoption coordinators for guidance.

#### 3. **Fill Out an Adoption Form**
- Complete a structured form to ensure the perfect match.
- Provide details about your living situation, experience with pets, and preferences.
- Submit required documents for verification.

#### 4. **AI Assistant for Assistance**
- Get instant answers to your queries regarding the adoption process.
- Ask about eligibility, necessary documents, and post-adoption policies.
- Receive guidance on pet care, training, and settling your new pet at home.

#### 5. **Policy & Support Assistance**
- Learn about adoption fees, return policies, and responsibilities.
- AI assistant helps clarify terms and conditions.
- 24/7 support for adopters throughout the process.

🎉 **Start your journey to finding a loving furry friend today!**

