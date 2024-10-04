import fs from "fs/promises";

//This approach will return the loyal customers according to the occurance of day 2.
//not returning in sorted order to save time complexity. This method is also optimised
//for space complexity.

// Helper function to read logs
async function readLog(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  const logEntries = data.split("\n").map((line) => {
    const [timestamp, pageId, customerId] = line.split(",");
    return {
      timestamp,
      pageId: parseInt(pageId, 10),
      customerId: parseInt(customerId, 10),
    };
  });
  return logEntries;
}

// Function to find loyal customers
async function findLoyalCustomers(logFile1, logFile2) {
  const log1 = await readLog(logFile1);
  const log2 = await readLog(logFile2);

  const day1Visits = new Map(); // Store customer and their pages for Day 1
  const loyalCustomers = new Set(); // Track loyal customers

  // Process Day 1 logs
  log1.forEach((entry) => {
    if (!day1Visits.has(entry.customerId)) {
      day1Visits.set(entry.customerId, new Set());
    }
    day1Visits.get(entry.customerId).add(entry.pageId);
  });

  // Process Day 2 logs
  log2.forEach((entry) => {
    const customerId = entry.customerId;
    const pageId = entry.pageId;

    // Check if the customer visited on Day 1
    if (day1Visits.has(customerId)) {
      const pagesVisitedOnDay1 = day1Visits.get(customerId);

      // Check if they visited at least one different page across both days
      if (!pagesVisitedOnDay1.has(pageId) || pagesVisitedOnDay1.size > 1) {
        loyalCustomers.add(customerId);
      }
    }
  });

  return Array.from(loyalCustomers);
}

// Main function to execute the logic
async function main() {
  const logFile1 = "./logs/log1.txt";
  const logFile2 = "./logs/log2.txt";

  const loyalCustomers = await findLoyalCustomers(logFile1, logFile2);
  console.log("Loyal Customers:", loyalCustomers);
}

main().catch((err) => console.error(err));
