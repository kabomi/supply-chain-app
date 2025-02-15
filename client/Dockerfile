# Use the official nginx alpine image
FROM nginx:alpine

# Copy the HTML files to the nginx html directory
COPY ./client/build /usr/share/nginx/html

# Expose the port nginx will run on
EXPOSE 5100

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
