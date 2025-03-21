🐶 Introducing Woof: Stray Dog Reporting & Adoption System 

📝 1. User Reporting System

📌 People can report stray dogs with the following details:
	-	Location: Auto-detect (GPS) or manual pin
	-	Photo Upload (for verification)
	-	Additional Notes (Optional) - To Specify dog's condition if its not visible through the image 
  - Vision AI Model for Condition Analysis of the dog: Analyzes the uploaded dog image and returns a condition classification and in-depth medical analysis:
    - 🟢 Healthy
    - 🟡 Mildly Injured/Sick
    - 🟠 Moderately Injured/Sick
    - 🔴 Critical Condition

🌍 2. AI-Based Hotspot Detection

# AI-Based Hotspot Detection Using DBSCAN

## Approach Overview
Our model enhances the traditional DBSCAN clustering algorithm with additional features to prioritize severe and recent reports. This approach ensures that the detected hotspots are more reflective of real-world situations.

## Key Features

### 1. **Density-Based Clustering (DBSCAN)**
DBSCAN is used as the base clustering algorithm, which works with two key parameters:
- **Epsilon (ε):** Defines the neighborhood radius around a point.
- **MinPts:** The minimum number of points required within ε to form a dense region.

DBSCAN categorizes points into:
- **Core Points:** Points with at least `MinPts` neighbors within `ε`.
- **Border Points:** Points within `ε` of a core point but not having enough neighbors themselves.
- **Noise Points (Outliers):** Points that do not belong to any cluster.

### 2. **Severity Weighting**
Reports are assigned severity levels, influencing their importance in clustering. Higher-severity reports contribute more to cluster formation.

### 3. **Time Decay Factor**
Older reports have reduced influence on the clustering process using an **exponential decay function**:
![Grad-CAM Example](/GradCAM/image1.png)
\[
Decay Factor = e^{-\lambda t}
\]
Where:
- `λ` (lambda) is the **decay constant**, controlling how quickly older reports lose significance.
- `t` is the **time difference (in hours)** between the report and the latest report.

![Grad-CAM Example](/GradCAM/image1.png)
The adjusted weight of a report is calculated as:
\[
Weight = Severity \times e^{-\lambda t}
\]
This ensures that recent severe reports dominate the clustering process.

### 4. **Custom Weighted Distance Function**
Instead of using standard Euclidean distance, we introduce a **modified distance function** that incorporates severity-based weighting:
\[
d_w(A, B) = \frac{\sqrt{(lat_1 - lat_2)^2 + (lon_1 - lon_2)^2}}{1 + \sqrt{w_1 \times w_2}}
\]
Where:
- `(lat_1, lon_1, w_1)` = Latitude, Longitude, and Weight of point A
- `(lat_2, lon_2, w_2)` = Latitude, Longitude, and Weight of point B
- `d_w(A, B)` is the **weighted distance** between two points.

This modification ensures that points with higher severity are more closely clustered.

## Conclusion
By integrating **severity weighting, time decay, and a custom distance function**, our enhanced DBSCAN model improves the identification of real-world hotspots. This ensures that clusters prioritize critical and recent reports while filtering out outdated or low-severity data.

📌 Tech Stack:
	•	Machine Learning: Python (Scikit-learn, GeoPandas)
	•	Database: PostgreSQL (stores reports & locations)
	•	Visualization: Folium (Python) / Leaflet.js (React)
	•	Google Maps API (for hotspot mapping)

⸻

🏥 3. Rescue Coordination System

📌 How it works?
	•	Shelters receive alerts for hotspots with many healthy dogs → They send teams to pick them up.
	•	Hospitals get emergency alerts when injured/sick dogs are reported.
	•	Users can track reports to see if action was taken.

📌 Tech Stack:
	•	Backend: Node.js / Spring Boot (for notifications)
	•	Notification System: Firebase Cloud Messaging (for alerts)
	•	Admin Panel for Shelters & Hospitals: React Dashboard

⸻

🏡 4. Adoption System

📌 How it works?
	•	Shelters list dogs available for adoption.
	•	People interested in adopting can fill out a form with:
	•	Personal Details (Name, Contact, Address)
	•	Dog Preferences (Age, Size, Breed, Temperament)
	•	Experience with Pets
	•	Home Environment Check (Optional)
	•	Once a form is submitted, the shelter reviews the request and matches them with a dog.
	•	Users can track their adoption request.

📌 Tech Stack:
	•	Frontend: React.js (Adoption Forms, Listings)
	•	Backend: Node.js / Spring Boot (Form Submission & Processing)
	•	Database: PostgreSQL (Stores Adoption Requests)
	•	Storage: Firebase / AWS S3 (Stores Dog Profiles & Images)
	•	Notification System: Firebase Cloud Messaging (Adoption Updates)
