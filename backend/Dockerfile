FROM python:3.7.2-slim

RUN mkdir /backend_app

WORKDIR /backend_app

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

COPY . .

RUN export PYTHONPATH=$PYTHONPATH:/backend_app/src

CMD ["python", "/backend_app/src/wsgi.py"]
