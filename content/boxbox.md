---
title: "BOXBOX"
label: "// Telemetry Stack"
subtitle: "Custom telemetry pipeline for karting performance analysis. Open source."
---

## Overview

While competitors rely on anecdotal "track feel," Pahim Racing utilizes **boxbox** — a custom-built telemetry pipeline that extracts, processes, and visualizes performance data from every session on track.

`boxbox` transforms raw GoPro metadata into actionable insights: precise GPS traces, accelerometer profiles, and gyroscope data that reveal where time is gained and where it is lost.

- **Live Application:** [boxbox.pahim.org](https://boxbox.pahim.org)
- **Source Code:** [github.com/apahim/boxbox](https://github.com/apahim/boxbox)

<img src="/img/boxbox-pipeline.png" alt="Pahim Racing Telemetry Pipeline Architecture (v2.0 Beta)" class="w-full rounded-lg border border-subtle mt-4 mb-4">

### Data Streams

- **GPS:** Latitude, longitude, altitude, and speed at 18Hz — precise enough to map racing lines through individual corners
- **Accelerometer (ACCL):** Lateral and longitudinal G-forces revealing braking points, apex loads, and traction zones
- **Gyroscope (GYRO):** Rotational velocity for detecting oversteer, understeer, and kart balance

## Analysis Methodology

Each session generates a **delta-time comparison** between the ideal lap (historical best) and the actual lap. The overlay visualizes exactly where time was gained or lost — sector by sector, corner by corner.

This is not guesswork. It is root cause analysis applied to lap time.

## Feature Roadmap

| Version | Feature | Status |
| :--- | :--- | :--- |
| **v2.0** | Core telemetry extraction and overlay pipeline | Operational |
| **v2.1** | OBD2/CAN bus integration for engine temp and RPM monitoring | In Development |
| **v2.2** | Predictive "Ideal Line" modeling using historical track data | Planned |
| **v2.3** | Real-time pit-to-driver technical feedback dashboard | Planned |

## Open Source

`boxbox` is open source. The methodology, the code, and the data pipeline are transparent and available for review. This is how an engineer builds credibility — not through claims, but through observable, reproducible systems.

<a href="https://github.com/apahim/boxbox" target="_blank" rel="noopener" class="btn-primary mt-4 no-underline hover:no-underline">View on GitHub &rarr;</a>&nbsp;&nbsp;<a href="https://boxbox.pahim.org" target="_blank" rel="noopener" class="btn-outline mt-4 no-underline hover:no-underline">Launch boxbox &rarr;</a>
