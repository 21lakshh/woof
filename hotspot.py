import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
import folium
from datetime import datetime, timedelta

# Sample Data: [Latitude, Longitude, Severity, Report Time]
# Severity weight: Emergency 🔴 = 5.0, Injured 🟡 = 2.5, Healthy 🟢 = 1.0
# Report Time format: YYYY-MM-DD HH:MM:SS

data = [
    [26.8415, 75.5659, 5.0, "2025-03-21 10:30:00"],  # Emergency 🔴
    [26.8418, 75.5662, 5.0, "2025-03-21 09:45:00"],  # Emergency 🔴
    [26.8420, 75.5665, 5.0, "2025-03-21 08:15:00"],  # Emergency 🔴
    [26.8412, 75.5661, 2.5, "2025-03-21 10:00:00"],  # Injured 🟡
    [26.8417, 75.5664, 5.0, "2025-03-21 10:15:00"],  # Emergency 🔴
    [26.8419, 75.5666, 5.0, "2025-03-21 11:00:00"],  # Emergency 🔴
    [26.8510, 75.5790, 5.0, "2025-03-21 11:30:00"],  # Emergency 🔴
    [26.8520, 75.5800, 5.0, "2025-03-21 11:45:00"],  # Emergency 🔴
    [26.8505, 75.5785, 5.0, "2025-03-21 06:45:00"],  # Emergency 🔴
    [26.8508, 75.5788, 5.0, "2025-03-21 12:00:00"],  # Emergency 🔴
    [26.8515, 75.5795, 2.5, "2025-03-21 07:30:00"],  # Injured 🟡
    [26.8850, 75.7300, 2.5, "2025-03-21 12:30:00"],  # Injured 🟡
    [26.8855, 75.7305, 5.0, "2025-03-21 13:00:00"],  # Emergency 🔴
    [26.8860, 75.7310, 5.0, "2025-03-21 13:15:00"],  # Emergency 🔴
    [26.8858, 75.7308, 2.5, "2025-03-21 14:00:00"],  # Injured 🟡
    [26.8865, 75.7315, 1.0, "2025-03-21 13:30:00"],  # Healthy 🟢
    [26.8700, 75.7800, 1.0, "2025-03-21 14:15:00"],  # Healthy 🟢
    [26.8705, 75.7805, 2.5, "2025-03-21 14:30:00"],  # Injured 🟡
    [26.8710, 75.7810, 1.0, "2025-03-21 15:00:00"],  # Healthy 🟢
    [26.8715, 75.7815, 1.0, "2025-03-21 15:30:00"],  # Healthy 🟢
    [26.8708, 75.7808, 2.5, "2025-03-21 16:00:00"],  # Injured 🟡
    [26.9120, 75.7450, 1.0, "2025-03-21 16:30:00"],  # Healthy 🟢
    [26.9125, 75.7455, 1.0, "2025-03-21 17:00:00"],  # Healthy 🟢
    [26.9130, 75.7460, 2.5, "2025-03-21 17:30:00"],  # Injured 🟡
    [26.9128, 75.7458, 1.0, "2025-03-21 18:00:00"],  # Healthy 🟢
    [26.9000, 75.7800, 1.0, "2025-03-21 18:30:00"],  # Healthy 🟢
    [26.9005, 75.7805, 1.0, "2025-03-21 19:00:00"],  # Healthy 🟢
    [26.9010, 75.7810, 2.5, "2025-03-21 19:15:00"],  # Injured 🟡
    [26.8500, 75.8000, 5.0, "2025-03-21 19:30:00"],  # Emergency 🔴
    [26.8505, 75.8005, 5.0, "2025-03-21 20:00:00"],  # Emergency 🔴
    [26.8510, 75.8010, 5.0, "2025-03-21 20:30:00"],  # Emergency 🔴
    [26.8512, 75.8012, 2.5, "2025-03-21 20:45:00"],  # Injured 🟡
    [26.8700, 75.8200, 5.0, "2025-03-21 21:00:00"],  # Emergency 🔴
    [26.8705, 75.8205, 5.0, "2025-03-21 21:30:00"],  # Emergency 🔴
    [26.8710, 75.8210, 5.0, "2025-03-21 22:00:00"],  # Emergency 🔴
    [26.8715, 75.8215, 2.5, "2025-03-21 22:30:00"],  # Injured 🟡
    [26.9500, 75.9000, 5.0, "2025-03-21 22:30:00"],  # Emergency 🔴
    [26.9600, 75.9100, 1.0, "2025-03-21 23:00:00"],  # Healthy 🟢
    [26.9700, 75.9200, 2.5, "2025-03-21 23:30:00"],  # Injured 🟡
    
    # Completely Random Outliers (Not Part of Any Cluster)
    [27.1000, 76.2000, 5.0, "2025-03-21 23:45:00"],  # Completely random point
    [27.1500, 76.2500, 1.0, "2025-03-21 00:15:00"],  # Completely random point
    [26.5000, 75.3000, 2.5, "2025-03-21 01:30:00"],  # Completely random point
    [27.3000, 76.5000, 5.0, "2025-03-21 02:00:00"],  # Completely random point
    [26.7000, 75.7000, 1.0, "2025-03-21 03:45:00"],  # Completely random point
    [26.2500, 75.0500, 2.5, "2025-03-21 04:30:00"],  # Completely random point
    [27.0000, 76.0000, 5.0, "2025-03-21 05:15:00"],  # Completely random point
]


# Convert to DataFrame
df = pd.DataFrame(data, columns=["Latitude", "Longitude", "Severity", "ReportTime"])
df["ReportTime"] = pd.to_datetime(df["ReportTime"])

# Time Decay Factor
lambda_decay = 0.1  # Higher = more weight to recent reports
current_time = df["ReportTime"].max()
# current_time = datetime.now()
print(current_time)

def compute_weight(row):
    time_diff = (current_time - row["ReportTime"]).total_seconds() / 3600  # Hours
    decay_factor = np.exp(-lambda_decay * time_diff)
    return row["Severity"] * decay_factor

df["Weight"] = df.apply(compute_weight, axis=1)

# Custom Weighted Distance Function
def weighted_distance(A, B):
    lat1, lon1, w1 = A
    lat2, lon2, w2 = B
    euclidean_dist = np.linalg.norm([lat1 - lat2, lon1 - lon2])
    return euclidean_dist / (1 + np.sqrt(w1 * w2))  

# Apply DBSCAN
coords_weights = df[["Latitude", "Longitude", "Weight"]].values
dbscan = DBSCAN(eps=0.01, min_samples=2, metric=weighted_distance)
df["Cluster"] = dbscan.fit_predict(coords_weights)

# Prioritize clusters based on severity & density
# Clusters that were outliers were balanced by adding additional weight so that single healthy dog wouldn't be given same priority as single emergency outlier 
cluster_priority = df.groupby("Cluster")["Weight"].sum().reset_index()
cluster_priority.columns = ["Cluster", "Priority"]
df = df.merge(cluster_priority, on="Cluster", how="left")
df["Priority"] = df.apply(lambda row: row["Priority"] * 0.25 if row["Cluster"] == -1 and row["Severity"] == 1.0 else row["Priority"], axis=1)
df["Priority"] = df.apply(lambda row: row["Priority"] * 0.3 if row["Cluster"] == -1 and row["Severity"] == 2.5 else row["Priority"], axis=1)


#  Visualization - Folium Map
map_center = [df["Latitude"].mean(), df["Longitude"].mean()]
m = folium.Map(location=map_center, zoom_start=15)

color_map = {5.0: "red", 2.5: "orange", 1.0: "green"}  # Emergency, Injured, Healthy

for _, row in df.iterrows():
    folium.CircleMarker(
        location=[row["Latitude"], row["Longitude"]],
        radius=8,
        color=color_map.get(row["Severity"], "blue"),
        fill=True,
        fill_color=color_map.get(row["Severity"], "blue"),
        fill_opacity=0.7,
        popup=f"Cluster: {row['Cluster']} | Priority: {row['Priority']:.2f}"
    ).add_to(m)

# Save & Show Map
m.save("hotspot_map.html")
print("🔥 Hotspot Map Saved as 'hotspot_map.html'")

print(df)
