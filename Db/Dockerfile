# Base image stage
FROM mcr.microsoft.com/azure-sql-edge:1.0.7 AS base

# Create app directory
WORKDIR /usr/src/app

# Copy initialization scripts
COPY . /usr/src/app

# Set environment variables, not to have to write them with docker run command
ENV SA_PASSWORD CorrectHorseBatteryStapleFor$
ENV ACCEPT_EULA Y
# ENV MSSQL_PID Express
# Expose port 1433 in case accessing from other container
EXPOSE 1433

# Final stage
FROM base AS final

# Run Microsoft SQL Server and initialization script (at the same time)
CMD /bin/bash ./entrypoint.sh