# EasyPoslty Backend with DJANGO
Post your content one signle time in different platforms at the same time with ease

## How to run ?

Before you run anything make sure you have all the env variables inside `.env` file and that you have set them all .
Please open ``settings.py` and make sure all the variables are correct .

### Installation
First make sure you you have python installed then run
`pip install -r requirements.txt`

### Make migrations
`python manage.py makemigrations`
then
`python manage.py migrate`

### Runinng

`python manage.py runserver 8000`

### Create admin user 
`python manage.py createsuperuser`